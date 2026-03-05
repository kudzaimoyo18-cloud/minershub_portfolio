-- ============================================================
-- Muqabla AI Job Agent - Database Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ===================================
-- 1. Subscriptions Table
-- ===================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===================================
-- 2. Usage Records Table
-- ===================================
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  applications_used INTEGER DEFAULT 0,
  ai_resume_tailors_used INTEGER DEFAULT 0,
  ai_cover_letters_used INTEGER DEFAULT 0,
  ai_interview_prep_used INTEGER DEFAULT 0,
  ats_score_checks_used INTEGER DEFAULT 0,
  recruiter_outreach_used INTEGER DEFAULT 0,
  auto_apply_used INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- ===================================
-- 3. AI Tasks Table
-- ===================================
CREATE TABLE IF NOT EXISTS ai_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'resume_tailor', 'cover_letter', 'interview_prep', 'ats_score',
    'job_match', 'recruiter_outreach', 'follow_up_message',
    'negotiation_coach', 'job_summary', 'screening_answers'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  input_data JSONB DEFAULT '{}',
  output_data JSONB,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  model TEXT,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ===================================
-- 4. Resumes Table
-- ===================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Resume',
  is_primary BOOLEAN DEFAULT FALSE,
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'txt')),
  parsed_data JSONB,
  ats_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 5. Resume Variants Table
-- ===================================
CREATE TABLE IF NOT EXISTS resume_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tailored_data JSONB NOT NULL,
  match_score INTEGER,
  keywords_matched TEXT[] DEFAULT '{}',
  keywords_missing TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 6. Cover Letters Table
-- ===================================
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id),
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'enthusiastic', 'formal', 'casual')),
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 7. Job Matches Table
-- ===================================
CREATE TABLE IF NOT EXISTS job_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL DEFAULT 0,
  skills_score INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  location_score INTEGER DEFAULT 0,
  salary_score INTEGER DEFAULT 0,
  match_reasons TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  is_dismissed BOOLEAN DEFAULT FALSE,
  is_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ===================================
-- 8. Match Preferences Table
-- ===================================
CREATE TABLE IF NOT EXISTS match_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_roles TEXT[] DEFAULT '{}',
  target_industries TEXT[] DEFAULT '{}',
  target_locations TEXT[] DEFAULT '{}',
  min_salary INTEGER,
  max_salary INTEGER,
  preferred_job_types TEXT[] DEFAULT '{}',
  preferred_work_modes TEXT[] DEFAULT '{}',
  preferred_seniority TEXT[] DEFAULT '{}',
  deal_breakers TEXT[] DEFAULT '{}',
  nice_to_haves TEXT[] DEFAULT '{}',
  remote_preference TEXT CHECK (remote_preference IN ('required', 'preferred', 'open')),
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  work_authorization TEXT,
  notice_period_days INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===================================
-- 9. Application Events Table (timeline)
-- ===================================
CREATE TABLE IF NOT EXISTS application_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'email_sync', 'system', 'ai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 10. Follow Ups Table
-- ===================================
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMPTZ NOT NULL,
  message_type TEXT DEFAULT 'initial' CHECK (message_type IN ('initial', 'second', 'final')),
  message_draft TEXT,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 11. Notifications Table
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'new_match', 'application_update', 'follow_up_reminder',
    'interview_reminder', 'daily_digest', 'subscription_alert', 'ai_task_complete'
  )),
  channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'push', 'whatsapp')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================
-- 12. Notification Preferences Table
-- ===================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  new_matches TEXT[] DEFAULT ARRAY['in_app', 'email'],
  application_updates TEXT[] DEFAULT ARRAY['in_app', 'email'],
  follow_up_reminders TEXT[] DEFAULT ARRAY['in_app'],
  interview_reminders TEXT[] DEFAULT ARRAY['in_app', 'email'],
  daily_digest TEXT[] DEFAULT ARRAY['email'],
  marketing TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===================================
-- Indexes for performance
-- ===================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_period ON usage_records(user_id, period_start);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_user_id ON ai_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_created ON ai_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_variants_user_job ON resume_variants(user_id, job_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_job ON cover_letters(user_id, job_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_score ON job_matches(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_match_preferences_user ON match_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_application_events_app ON application_events(application_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user ON follow_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled ON follow_ups(scheduled_date) WHERE NOT is_sent;
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE NOT is_read;

-- ===================================
-- RLS Policies
-- ===================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Usage records
CREATE POLICY "Users can view own usage" ON usage_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage_records
  FOR UPDATE USING (auth.uid() = user_id);

-- AI tasks
CREATE POLICY "Users can view own ai tasks" ON ai_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai tasks" ON ai_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai tasks" ON ai_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Resumes
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- Resume variants
CREATE POLICY "Users can manage own resume variants" ON resume_variants
  FOR ALL USING (auth.uid() = user_id);

-- Cover letters
CREATE POLICY "Users can manage own cover letters" ON cover_letters
  FOR ALL USING (auth.uid() = user_id);

-- Job matches
CREATE POLICY "Users can manage own job matches" ON job_matches
  FOR ALL USING (auth.uid() = user_id);

-- Match preferences
CREATE POLICY "Users can manage own match preferences" ON match_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Application events
CREATE POLICY "Users can view own application events" ON application_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_events.application_id
      AND applications.candidate_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own application events" ON application_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_events.application_id
      AND applications.candidate_id = auth.uid()
    )
  );

-- Follow ups
CREATE POLICY "Users can manage own follow ups" ON follow_ups
  FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Notification preferences
CREATE POLICY "Users can manage own notification prefs" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);
