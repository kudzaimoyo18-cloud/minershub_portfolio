# Muqabla - Video-First Job Platform (Web App)

Build a modern web application for **Muqabla** — a video-first job matching platform for the GCC region (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). The tagline is "Your video is your resume."

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for auth & database
- **shadcn/ui** for components

## Supabase Connection
```
NEXT_PUBLIC_SUPABASE_URL=https://ssttxhadegoyiianjitw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdHR4aGFkZWdveWlpYW5qaXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDI1NDYsImV4cCI6MjA4NTc3ODU0Nn0.AkJKe2PhGjRLFOmW7elbCQFjexqaJxfzHP7N5K596WE
```

## Design System

### Colors
- Primary: `#0D7377` (Deep Teal)
- Primary Light: `#14919B`
- Primary Dark: `#095759`
- Accent: `#C9A227` (Warm Gold)
- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text: `#1A1A2E`
- Text Secondary: `#6B7280`
- Success: `#2ECC71`
- Error: `#E74C3C`
- Warning: `#F39C12`
- Border: `#E5E7EB`

### Style
- Clean, professional, modern
- Rounded corners (12px cards, 20px chips)
- Teal primary buttons with white text
- Gold accents for highlights and badges

## Database Tables (already exist in Supabase)

### `users`
- id (uuid, PK, matches auth.users)
- email, phone, type ('candidate' | 'employer'), full_name, full_name_ar
- avatar_url, language ('en' | 'ar'), is_verified, is_active
- created_at, updated_at

### `candidates`
- id (uuid, PK, FK → users)
- headline, headline_ar, current_title, current_company
- years_experience (int), city, country
- willing_relocate (bool), desired_salary_min/max
- desired_job_types (text[]), desired_industries (text[])
- profile_video_id (FK → videos)
- emirates_id_verified, linkedin_url, linkedin_verified
- profile_views, applications_count

### `companies`
- id (uuid, PK), name, name_ar, slug, logo_url, cover_image_url
- industry, size, founded_year, website
- description, description_ar, headquarters, locations (text[])
- trade_license, is_verified, verified_at
- intro_video_id (FK → videos)
- jobs_posted, total_hires, response_rate, avg_response_time, created_at

### `employers`
- id (uuid, PK, FK → users), company_id (FK → companies)
- role ('admin' | 'recruiter'), title
- can_post_jobs, can_manage_team

### `jobs`
- id (uuid, PK), company_id (FK), posted_by (FK → users)
- title, title_ar, description, description_ar
- requirements (text[]), requirements_ar (text[])
- department, seniority ('entry' | 'mid' | 'senior' | 'lead' | 'executive')
- job_type ('full_time' | 'part_time' | 'contract' | 'freelance' | 'internship')
- work_mode ('on_site' | 'remote' | 'hybrid')
- city, country, salary_min/max, salary_currency, show_salary
- benefits (text[]), video_id (FK → videos)
- status ('draft' | 'active' | 'paused' | 'closed')
- views, applications_count, created_at, published_at, expires_at

### `applications`
- id (uuid, PK), job_id (FK), candidate_id (FK), video_id (FK)
- cover_message, status ('pending' | 'viewed' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected')
- match_score, viewed_at, shortlisted_at, rejected_at, rejection_reason
- created_at, updated_at

### `saved_jobs`
- candidate_id (FK), job_id (FK), created_at

### `videos`
- id (uuid, PK), owner_id (FK → users)
- type ('profile' | 'application' | 'job_post' | 'company_intro')
- duration, thumbnail_url, mux_asset_id, mux_playback_id
- status ('uploading' | 'processing' | 'ready' | 'failed')
- transcript, transcript_ar, language, skills_detected (text[]), created_at

## Pages to Build

### 1. Auth Pages
- **`/login`** — Email + password sign in. Link to register.
- **`/register`** — Role selection (candidate "Find a Job" / employer "Hire Talent"), email, password, confirm password. Redirects to onboarding.
- **`/onboarding/candidate`** — Multi-step: name + headline → country + city + experience level → industry interests. Uses GCC countries/cities below.
- **`/onboarding/employer`** — Multi-step: name + job title → company name + industry + size + website.

### 2. Candidate Pages
- **`/feed`** — Job feed with cards showing: company logo, job title, company name, city, job type, salary range, posted date. Infinite scroll. Filter by city, job type, work mode.
- **`/jobs/[id]`** — Full job details with company info, requirements, benefits. "Apply with Video" CTA button. Save job button.
- **`/applications`** — List of user's applications with status badges (pending/viewed/shortlisted/interviewing/offered/hired/rejected).
- **`/saved`** — Saved jobs list.
- **`/profile`** — User profile: avatar, name, headline, location, experience, industries. Edit profile form. Sign out button.

### 3. Employer Pages
- **`/dashboard`** — Overview: total jobs posted, total applications, recent applications.
- **`/jobs/manage`** — List of company's jobs with status, views, application count. Create new job button.
- **`/jobs/create`** — Form: title, description, requirements, department, seniority, job type, work mode, city, country, salary, benefits.
- **`/jobs/[id]/applications`** — List of applications for a job. View candidate video, shortlist/reject.

### 4. Shared
- **Navigation** — Sidebar on desktop, bottom tabs on mobile. Candidate sees: Feed, Applications, Saved, Profile. Employer sees: Dashboard, Jobs, Profile.
- **Auth guard** — Redirect unauthenticated users to `/login`. Redirect authenticated users away from auth pages.

## GCC Config Data

### Countries
- AE: United Arab Emirates
- SA: Saudi Arabia
- QA: Qatar
- KW: Kuwait
- BH: Bahrain
- OM: Oman

### Cities by Country
- AE: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah
- SA: Riyadh, Jeddah, Dammam, Mecca, Medina
- QA: Doha, Al Wakrah, Al Khor
- KW: Kuwait City, Hawalli, Salmiya
- BH: Manama, Riffa, Muharraq
- OM: Muscat, Salalah, Sohar

### Industries
Technology, Finance & Banking, Healthcare, Retail, Hospitality, Construction, Education, Marketing, Logistics, Oil & Gas, Real Estate, Other

### Experience Levels
- Entry Level (0-2y)
- Mid Level (3-5y)
- Senior (6-10y)
- Lead/Manager (10+y)
- Executive (15+y)

### Company Sizes
1-10, 11-50, 51-200, 201-500, 501-1000, 1000+

## Supabase Query Examples

### Get jobs feed
```ts
const { data } = await supabase
  .from('jobs')
  .select('*, company:companies(*)')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(10);
```

### Search jobs
```ts
const { data } = await supabase
  .from('jobs')
  .select('*, company:companies(*)')
  .eq('status', 'active')
  .ilike('title', `%${query}%`)
  .eq('city', city)
  .order('created_at', { ascending: false });
```

### Create application
```ts
const { data } = await supabase
  .from('applications')
  .insert({ job_id, candidate_id, cover_message, status: 'pending' })
  .select()
  .single();
```

### Get candidate applications
```ts
const { data } = await supabase
  .from('applications')
  .select('*, job:jobs(*, company:companies(*))')
  .eq('candidate_id', userId)
  .order('created_at', { ascending: false });
```

## Important Notes
- The Supabase database already exists with all tables. Do NOT create migrations or SQL — just query the existing tables.
- Auth uses Supabase Auth (email/password). Use `@supabase/ssr` for Next.js.
- Make it mobile-responsive (many users will be on phones).
- Use the teal + gold color scheme consistently.
- Status badges should use colored pills matching the status colors.
