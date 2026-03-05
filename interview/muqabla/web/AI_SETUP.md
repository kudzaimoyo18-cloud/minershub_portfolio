# Muqabla Web App - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and add your API keys:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://ssttxhadegoyiianjitw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Hugging Face API (for AI features)
HUGGINGFACE_API_KEY=hf_your_key_here
```

### 3. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token (read access is sufficient)
5. Copy the token and add to `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## AI Features

The app includes free AI tools powered by Hugging Face:

### 1. Cover Letter Generator
- Creates personalized cover letters
- Takes job description and candidate info
- Optimized for GCC job market

### 2. Follow-Up Message Generator
- Generates polite follow-up messages
- Helps check application status
- Professional and culturally appropriate

### 3. Job Summarizer
- Summarizes long job descriptions
- Quick overview of requirements
- Saves time when browsing jobs

### Access AI Tools

Navigate to `/ai-tools` after logging in, or access from the dashboard.

---

## Authentication

### Login
- Email and password authentication
- Powered by Supabase Auth
- Redirects to feed after login

### Register
- Role selection (Candidate/Employer)
- Email, password setup
- Redirects to onboarding

---

## Troubleshooting

### Login Errors

If you encounter login errors:

1. **Check Supabase Connection**
   ```bash
   # Verify environment variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Clear Browser Cookies**
   - Open browser DevTools
   - Go to Application → Cookies
   - Delete cookies for localhost

3. **Check Middleware**
   - Ensure `middleware.ts` is properly configured
   - Verify Supabase session handling

4. **Database Connection**
   - Check if Supabase project is active
   - Verify email confirmation is enabled in Supabase

### AI Tool Errors

If AI tools don't work:

1. **Verify Hugging Face API Key**
   ```bash
   echo $HUGGINGFACE_API_KEY
   ```

2. **Check API Rate Limits**
   - Free tier: 30,000 calls/month
   - Upgrade to Pro if needed

3. **Test API Manually**
   ```bash
   curl -X POST https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2 \
     -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"inputs": "Hello, world!"}'
   ```

---

## Project Structure

```
web/
├── app/
│   ├── (app)/          # Authenticated routes
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── api/           # API routes
│   │   └── ai/       # AI endpoints
│   └── layout.tsx     # Root layout
├── components/        # Reusable components
│   └── ui/           # UI components (shadcn/ui)
├── lib/              # Utilities
│   ├── huggingface.ts # Hugging Face integration
│   ├── supabase/     # Supabase client
│   └── types.ts      # TypeScript types
├── stores/           # State management (Zustand)
└── public/           # Static assets
```

---

## Available Pages

### Public
- `/` - Landing page
- `/login` - Login
- `/register` - Register

### Authenticated (Candidate)
- `/feed` - Job feed
- `/jobs/[id]` - Job details
- `/applications` - My applications
- `/saved` - Saved jobs
- `/profile` - Profile settings
- `/ai-tools` - AI tools

### Authenticated (Employer)
- `/dashboard` - Dashboard
- `/jobs/manage` - Manage jobs
- `/jobs/create` - Create job
- `/jobs/[id]/applications` - Job applications

---

## Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `HUGGINGFACE_API_KEY` | Optional | For AI features |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | For payments |
| `STRIPE_SECRET_KEY` | Optional | For payments |

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Hugging Face Docs: https://huggingface.co/docs/api-inference
- Next.js Docs: https://nextjs.org/docs

---

## Next Steps

1. Set up your Hugging Face API key
2. Test the login functionality
3. Try the AI tools at `/ai-tools`
4. Deploy to production when ready

Happy coding! 🚀
