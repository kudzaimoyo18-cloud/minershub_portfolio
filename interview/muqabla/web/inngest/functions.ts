import { inngest } from "@/lib/inngest";
import { createClient } from "@supabase/supabase-js";

// Lazy-init admin client for background functions
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ===================================
// Daily Job Matching
// Runs every day at 7 AM UTC
// ===================================
export const dailyJobMatching = inngest.createFunction(
  { id: "daily-job-matching", name: "Daily Job Matching" },
  { cron: "0 7 * * *" },
  async ({ step }) => {
    // Step 1: Get all users with active paid subscriptions
    const users = await step.run("get-paid-users", async () => {
      const { data } = await getSupabaseAdmin()
        .from("subscriptions")
        .select("user_id")
        .in("plan_id", ["pro", "enterprise"])
        .eq("status", "active");
      return data || [];
    });

    // Step 2: For each user, find matching jobs
    for (const { user_id } of users) {
      await step.run(`match-user-${user_id}`, async () => {
        // Get user's match preferences
        const { data: prefs } = await getSupabaseAdmin()
          .from("match_preferences")
          .select("*")
          .eq("user_id", user_id)
          .single();

        if (!prefs) return { skipped: true, reason: "no preferences" };

        // Get user's candidate profile
        const { data: candidate } = await getSupabaseAdmin()
          .from("candidates")
          .select("*")
          .eq("id", user_id)
          .single();

        if (!candidate) return { skipped: true, reason: "no candidate profile" };

        // Get recent jobs matching preferences (last 24 hours)
        let query = getSupabaseAdmin()
          .from("jobs")
          .select("*")
          .eq("status", "active")
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        // Apply location filter
        if (prefs.target_locations?.length > 0) {
          query = query.in("city", prefs.target_locations);
        }

        // Apply job type filter
        if (prefs.preferred_job_types?.length > 0) {
          query = query.in("job_type", prefs.preferred_job_types);
        }

        const { data: jobs } = await query.limit(50);

        if (!jobs || jobs.length === 0) {
          return { matched: 0 };
        }

        // Score each job (simplified scoring - full AI scoring happens on demand)
        let matchCount = 0;
        for (const job of jobs) {
          // Check if already matched
          const { data: existing } = await getSupabaseAdmin()
            .from("job_matches")
            .select("id")
            .eq("user_id", user_id)
            .eq("job_id", job.id)
            .single();

          if (existing) continue;

          // Basic scoring
          let score = 50; // base score

          // Location match
          if (prefs.target_locations?.includes(job.city)) score += 15;

          // Job type match
          if (prefs.preferred_job_types?.includes(job.job_type)) score += 10;

          // Work mode match
          if (prefs.preferred_work_modes?.includes(job.work_mode)) score += 10;

          // Salary match
          if (prefs.min_salary && job.salary_min) {
            if (job.salary_min >= prefs.min_salary) score += 10;
            else score -= 10;
          }

          // Industry match
          if (prefs.target_industries?.length > 0 && job.department) {
            if (prefs.target_industries.some((ind: string) =>
              job.department?.toLowerCase().includes(ind.toLowerCase())
            )) {
              score += 5;
            }
          }

          score = Math.min(100, Math.max(0, score));

          if (score >= 40) {
            await getSupabaseAdmin().from("job_matches").insert({
              user_id,
              job_id: job.id,
              overall_score: score,
              location_score: prefs.target_locations?.includes(job.city) ? 100 : 50,
              match_reasons: [],
              red_flags: [],
            });
            matchCount++;
          }
        }

        // Create notification if new matches found
        if (matchCount > 0) {
          await getSupabaseAdmin().from("notifications").insert({
            user_id,
            type: "new_match",
            channel: "in_app",
            title: `${matchCount} new job match${matchCount > 1 ? "es" : ""} found!`,
            body: `We found ${matchCount} new jobs that match your preferences. Check your matches!`,
            data: { match_count: matchCount },
          });
        }

        return { matched: matchCount };
      });
    }

    return { processed: users.length };
  }
);

// ===================================
// Follow-Up Reminder Check
// Runs every 4 hours
// ===================================
export const followUpCheck = inngest.createFunction(
  { id: "follow-up-check", name: "Follow Up Reminder Check" },
  { cron: "0 */4 * * *" },
  async ({ step }) => {
    // Find overdue follow-ups
    const overdueFollowUps = await step.run("get-overdue-follow-ups", async () => {
      const { data } = await getSupabaseAdmin()
        .from("follow_ups")
        .select("*, applications(*, jobs(title, company:companies(name)))")
        .eq("is_sent", false)
        .lte("scheduled_date", new Date().toISOString())
        .limit(100);
      return data || [];
    });

    for (const followUp of overdueFollowUps) {
      await step.run(`notify-follow-up-${followUp.id}`, async () => {
        const application = followUp.applications;
        const jobTitle = application?.jobs?.title || "a position";
        const companyName = application?.jobs?.company?.name || "the company";

        await getSupabaseAdmin().from("notifications").insert({
          user_id: followUp.user_id,
          type: "follow_up_reminder",
          channel: "in_app",
          title: "Time to follow up!",
          body: `It's time to follow up on your application for ${jobTitle} at ${companyName}.`,
          data: {
            follow_up_id: followUp.id,
            application_id: followUp.application_id,
          },
        });
      });
    }

    return { reminders_sent: overdueFollowUps.length };
  }
);

// ===================================
// Monthly Usage Reset
// Runs on 1st of every month at midnight
// ===================================
export const monthlyUsageReset = inngest.createFunction(
  { id: "monthly-usage-reset", name: "Monthly Usage Reset" },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all users with subscriptions
    const users = await step.run("get-all-subscribers", async () => {
      const { data } = await getSupabaseAdmin()
        .from("subscriptions")
        .select("user_id")
        .in("status", ["active", "trialing"]);
      return data || [];
    });

    // Create new usage records
    const records = users.map((u: { user_id: string }) => ({
      user_id: u.user_id,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      applications_used: 0,
      ai_resume_tailors_used: 0,
      ai_cover_letters_used: 0,
      ai_interview_prep_used: 0,
      ats_score_checks_used: 0,
      recruiter_outreach_used: 0,
      auto_apply_used: 0,
      ai_tokens_used: 0,
    }));

    if (records.length > 0) {
      await step.run("create-usage-records", async () => {
        await getSupabaseAdmin().from("usage_records").insert(records);
      });
    }

    return { reset_count: records.length };
  }
);

// ===================================
// Application Prepare Package
// Triggered when user requests AI preparation for a job
// ===================================
export const prepareApplicationPackage = inngest.createFunction(
  {
    id: "prepare-application-package",
    name: "Prepare Application Package",
  },
  { event: "application/prepare-package" },
  async ({ event, step }) => {
    const { userId, jobId, includeResume, includeCoverLetter, includeScreeningAnswers } =
      event.data;

    // Step 1: Get job details
    const job = await step.run("get-job", async () => {
      const { data } = await getSupabaseAdmin()
        .from("jobs")
        .select("*, company:companies(*)")
        .eq("id", jobId)
        .single();
      return data;
    });

    if (!job) throw new Error("Job not found");

    // Step 2: Get candidate profile
    const candidate = await step.run("get-candidate", async () => {
      const { data: userData } = await getSupabaseAdmin()
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      const { data: candidateData } = await getSupabaseAdmin()
        .from("candidates")
        .select("*")
        .eq("id", userId)
        .single();
      return { ...userData, ...candidateData };
    });

    // Step 3: Get primary resume
    const resume = await step.run("get-resume", async () => {
      const { data } = await getSupabaseAdmin()
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .eq("is_primary", true)
        .single();
      return data;
    });

    const results: Record<string, unknown> = {};

    // Step 4: Tailor resume (if requested)
    if (includeResume && resume?.parsed_data) {
      results.resume = await step.run("tailor-resume", async () => {
        // This would call the AI API internally
        // For now, it creates a task record
        const { data: task } = await getSupabaseAdmin()
          .from("ai_tasks")
          .insert({
            user_id: userId,
            task_type: "resume_tailor",
            status: "pending",
            input_data: { job_id: jobId, resume_id: resume.id },
            model: "claude-sonnet-4-20250514",
          })
          .select()
          .single();
        return { task_id: task?.id, status: "queued" };
      });
    }

    // Step 5: Generate cover letter (if requested)
    if (includeCoverLetter) {
      results.coverLetter = await step.run("generate-cover-letter", async () => {
        const { data: task } = await getSupabaseAdmin()
          .from("ai_tasks")
          .insert({
            user_id: userId,
            task_type: "cover_letter",
            status: "pending",
            input_data: { job_id: jobId },
            model: "claude-sonnet-4-20250514",
          })
          .select()
          .single();
        return { task_id: task?.id, status: "queued" };
      });
    }

    // Step 6: Generate screening answers (if requested)
    if (includeScreeningAnswers) {
      results.screeningAnswers = await step.run("generate-screening-answers", async () => {
        const { data: task } = await getSupabaseAdmin()
          .from("ai_tasks")
          .insert({
            user_id: userId,
            task_type: "screening_answers",
            status: "pending",
            input_data: { job_id: jobId },
            model: "claude-sonnet-4-20250514",
          })
          .select()
          .single();
        return { task_id: task?.id, status: "queued" };
      });
    }

    // Notify user
    await step.run("notify-user", async () => {
      await getSupabaseAdmin().from("notifications").insert({
        user_id: userId,
        type: "ai_task_complete",
        channel: "in_app",
        title: "Application package ready!",
        body: `Your AI-prepared application for ${job.title} at ${job.company?.name} is ready to review.`,
        data: { job_id: jobId, results },
      });
    });

    return results;
  }
);

// Export all functions
export const functions = [
  dailyJobMatching,
  followUpCheck,
  monthlyUsageReset,
  prepareApplicationPackage,
];
