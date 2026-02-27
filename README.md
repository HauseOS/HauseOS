# HauseOS

**Operational Hub & CEO Dashboard for Hause Collective**

Central platform where all work (strategy, content, outreach, operations) gets tracked, reviewed, and approved before shipping. Single source of truth for Yeeling, Anders, and all agents.

## Features (MVP)

- ✅ Work submission API (agents submit work)
- ✅ Approval queue (review & approve/reject)
- ✅ Status dashboard (pending, approved, shipped)
- ✅ User authentication (JWT)
- ✅ Telegram bot integration (notifications, inline approvals)
- ✅ PostgreSQL backend (Supabase)

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT
- **Notifications:** Telegram Bot API
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase account)
- Vercel account
- Telegram Bot token

### Setup

1. **Clone & install:**
   ```bash
   git clone https://github.com/yeelingchua/HauseOS.git
   cd HauseOS
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase URL, JWT secret, Telegram token
   ```

3. **Initialize database:**
   ```bash
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

## API Endpoints (Coming Soon)

- `POST /api/work/submit` - Submit work for approval
- `GET /api/work/queue` - Get approval queue
- `POST /api/work/:id/approve` - Approve work
- `POST /api/work/:id/reject` - Reject work
- `GET /api/dashboard` - CEO dashboard metrics

## Database Schema

**Users:**
- id, name, email, role (admin/approver/agent), created_at

**Work Submissions:**
- id, title, type, author_id, content, status, priority, created_at, updated_at, approved_by, approved_at

**Approvals:**
- id, work_id, approver_id, decision, notes, created_at

**Agent Logs:**
- id, agent_name, action, work_id, metadata, created_at

## Deployment

### To Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy --prod
```

## Roadmap

- Week 1: Core API + approval queue
- Week 2: Telegram bot + notifications
- Week 3: Dashboard + analytics
- Phase 2: Content calendar + YouTube sync
- Phase 3: Revenue operations + pipeline tracking
- Phase 4: Full SSOT (all company data)

## Development

```bash
npm run dev       # Start with file watching
npm run start     # Production start
npm run migrate   # Run database migrations
npm run seed      # Seed initial data
```

## Contributing

All work goes through HauseOS approval workflow. Push feature branches, open PRs, get approval before merging.

## License

Private — Hause Collective
