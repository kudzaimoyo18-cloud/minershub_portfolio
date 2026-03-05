# Quick Start Guide - Muqabla Web App

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd web
npm install
```

### Step 2: Add Hugging Face API Key

1. Go to https://huggingface.co/settings/tokens
2. Create a new token (Read access is enough)
3. Copy the token (starts with `hf_`)

Edit `.env.local`:
```env
HUGGINGFACE_API_KEY=hf_your_actual_key_here
```

### Step 3: Start the Server
```bash
npm run dev
```

### Step 4: Open in Browser
Go to http://localhost:3000

---

## 🎯 Test the Features

### Test Login
1. Go to http://localhost:3000/login
2. Enter email and password
3. If you don't have an account, register first at /register

### Test AI Tools
1. Login to the app
2. Navigate to http://localhost:3000/ai-tools
3. Try:
   - **Cover Letter Generator** - Generate a cover letter
   - **Follow-Up Message** - Create a follow-up email
   - **Job Summarizer** - Summarize a job description

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| [`.env.local`](.env.local) | Environment variables |
| [`lib/huggingface.ts`](lib/huggingface.ts) | AI integration |
| [`app/(app)/ai-tools/page.tsx`](app/(app)/ai-tools/page.tsx) | AI tools UI |
| [`AI_SETUP.md`](AI_SETUP.md) | Full documentation |
| [`CHANGES_SUMMARY.md`](CHANGES_SUMMARY.md) | All changes |

---

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## ⚠️ Troubleshooting

### Can't log in?
1. Check Supabase env variables
2. Clear browser cookies
3. See [AI_SETUP.md](AI_SETUP.md) for details

### AI tools not working?
1. Check `HUGGINGFACE_API_KEY` in `.env.local`
2. Verify token is valid at huggingface.co
3. Check browser console for errors

### Build errors?
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📚 Learn More

- [Full Setup Guide](AI_SETUP.md)
- [Changes Summary](CHANGES_SUMMARY.md)
- [Hugging Face Docs](https://huggingface.co/docs/api-inference)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

## ✨ What's New?

**Hugging Face AI Integration**
- ✅ Free AI tools
- ✅ Cover letter generator
- ✅ Follow-up message generator
- ✅ Job summarizer
- ✅ No API costs (up to 30K calls/month)

---

**Happy Coding! 🎉**
