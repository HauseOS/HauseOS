# HauseOS Setup Guide

## Backend Infrastructure Ready ✅

The backend boilerplate is set up and pushed to GitHub:
- **Repo:** https://github.com/HauseOS/HauseOS
- **Status:** Ready for database + deployment configuration

## Next Steps

### 1. Supabase Setup (5 min)

HauseOS uses Supabase (PostgreSQL) for the database.

**Option A: Create New Supabase Project**
1. Go to https://supabase.com
2. Sign in with os@hause.co or create account
3. Create new project (name: `hause-ops`)
4. Wait for database to initialize (~2 min)
5. Go to **Settings → Database → Connection String**
6. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`)

**Option B: Use Existing Supabase (if available)**
1. Check if os@hause.co already has Supabase account
2. Get the connection string from existing project

### 2. Environment Configuration

Once you have the Supabase connection string:

1. Clone the repo locally:
   ```bash
   git clone https://github.com/HauseOS/HauseOS.git
   cd HauseOS
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your values:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   JWT_SECRET=your-random-secret-here-at-least-32-chars
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
   NODE_ENV=development
   PORT=3000
   ```

   **For JWT_SECRET:** Generate a random string. You can use:
   ```bash
   openssl rand -base64 32
   ```

   **For TELEGRAM_BOT_TOKEN:** (Optional for MVP, add later)
   - Create bot via @BotFather on Telegram
   - Get token, paste here

### 3. Local Database Setup

```bash
npm install
npm run migrate
```

This creates all tables in your Supabase database.

### 4. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` — should see: `{ "status": "HauseOS running", "version": "0.1.0" }`

### 5. Deploy to Vercel

1. **Connect to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Import Project"
   - Connect GitHub repo: `HauseOS/HauseOS`

2. **Set Environment Variables in Vercel:**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL` (from Supabase)
     - `JWT_SECRET` (generate new for production)
     - `TELEGRAM_BOT_TOKEN` (optional)
     - `NODE_ENV` → `production`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

   Or just push to `main` branch — Vercel auto-deploys.

### 6. Verify Production

Once deployed, visit your Vercel URL (e.g., `https://hause-ops.vercel.app`) and confirm it returns the status JSON.

---

## Architecture Summary

```
GitHub (HauseOS)
    ↓
Vercel (hause-ops.vercel.app)
    ↓
Supabase PostgreSQL
    ↓
Telegram Bot (notifications)
```

## What's Ready

- ✅ Backend API scaffold
- ✅ Database schema (users, work_submissions, approvals, agent_logs)
- ✅ Auth middleware (JWT)
- ✅ Telegram bot placeholder
- ✅ GitHub repo + git workflow

## What's Next

Once infrastructure is live:
1. Build work submission API endpoint
2. Build approval queue endpoint
3. Build Telegram notification bot
4. Build CEO dashboard queries
5. Iterate based on usage

---

**Questions?** Ask Aurelius. Infrastructure is the foundation — everything else builds on this.
