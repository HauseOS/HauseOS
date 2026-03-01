# Editorial MVP - Testing Guide

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL / Supabase connection
- Telegram bot token (optional for development)

### Environment Setup
```bash
cp .env.example .env.local
```

Set these in `.env.local`:
```env
DATABASE_URL=postgresql://...  # Your Supabase connection
JWT_SECRET=test_secret_key_change_in_prod
NODE_ENV=development
# Optional for Telegram notifications:
TELEGRAM_BOT_TOKEN=your_bot_token
YEELING_CHAT_ID=your_chat_id
```

### Local Development
```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`

## Testing the API

### 1. Generate JWT Token (for agent requests)
```bash
# Create a token for agent access
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { 
    name: 'Aurelius', 
    agent_name: 'aurelius', 
    role: 'agent' 
  },
  'test_secret_key_change_in_prod'
);
console.log('Agent Token:', token);
"

# Create a token for approver (Yeeling)
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { 
    name: 'Yeeling', 
    role: 'admin' 
  },
  'test_secret_key_change_in_prod'
);
console.log('Admin Token:', token);
"
```

### 2. Test Video Ideas

#### Create an idea (agent)
```bash
curl -X POST http://localhost:3000/api/editorial/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AGENT_TOKEN" \
  -d '{
    "title": "Testing AI Workflows",
    "angle": "How to set up your first AI agent in production",
    "audience_hook": "Developers who want to ship AI fast",
    "description": "Step-by-step guide...",
    "tags": ["ai-tool", "workflow", "tutorial"],
    "partner_fit": ["Anthropic", "OpenAI"],
    "estimated_production_hours": 3,
    "estimated_difficulty": "simple"
  }'
```

#### List all ideas
```bash
curl -X GET "http://localhost:3000/api/editorial/ideas?status=brainstorm&sortBy=date" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get single idea with notes
```bash
curl -X GET http://localhost:3000/api/editorial/ideas/{idea_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update own idea (agent)
```bash
curl -X PATCH http://localhost:3000/api/editorial/ideas/{idea_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AGENT_TOKEN" \
  -d '{
    "angle": "Updated angle text here",
    "description": "New description"
  }'
```

#### Change status (admin/approver)
```bash
curl -X PATCH http://localhost:3000/api/editorial/ideas/{idea_id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "greenlit",
    "note": "Love this idea, ready for production!"
  }'
```

#### Add feedback note (admin/approver)
```bash
curl -X POST http://localhost:3000/api/editorial/ideas/{idea_id}/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "text": "Can you add more details on the target audience?",
    "type": "feedback"
  }'
```

#### Like an idea (admin/approver)
```bash
curl -X POST http://localhost:3000/api/editorial/ideas/{idea_id}/reactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "reaction_type": "love"
  }'
```

#### Reject an idea (admin/approver)
```bash
curl -X DELETE http://localhost:3000/api/editorial/ideas/{idea_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "rejection_reason": "Doesn'"'"'t fit current audience focus"
  }'
```

### 3. Test Research Drops

#### Create research drop
```bash
curl -X POST http://localhost:3000/api/editorial/research \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AGENT_TOKEN" \
  -d '{
    "topic": "Vector Database Trends 2026",
    "summary": "New research shows shifting preferences in vector DB choices",
    "key_findings": [
      "Qdrant gaining 40% YoY adoption",
      "Milvus preferred by enterprises",
      "Cost is now the primary decision factor"
    ],
    "partner_fit": ["Pinecone", "Weaviate", "Qdrant"],
    "urgency": "high",
    "suggested_angles": [
      "Why teams are switching to Qdrant",
      "Vector DB cost comparison 2026"
    ]
  }'
```

#### List research drops
```bash
curl -X GET "http://localhost:3000/api/editorial/research?urgency=high&sortBy=date" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get single research drop
```bash
curl -X GET http://localhost:3000/api/editorial/research/{drop_id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Test Dashboard

#### Get stats (admin/approver only)
```bash
curl -X GET "http://localhost:3000/api/editorial/dashboard/stats?timeRange=30days" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Response:
```json
{
  "ideas_submitted": 12,
  "ideas_greenlit": 4,
  "ideas_published": 2,
  "ideas_rejected": 3,
  "status_distribution": [...],
  "agent_contributions": [...],
  "avg_time_to_greenlit_days": 4.2,
  "trending_tags": [...]
}
```

## Sample Data

The app auto-seeds 3 test ideas and 1 research drop on startup (development mode):

1. **Brainstorm idea** - "AI Agents for Solopreneurs" (from Aurelius)
2. **Under Review idea** - "Vector Database Showdown 2026" (from Curie, with feedback)
3. **Greenlit idea** - "How to Build Your Own AI Tool" (from Aurelius, approved)
4. **Research drop** - "Gen Z Creator Economics Shift" (from Curie, HIGH urgency)

These are cleared on next start. To keep test data, comment out the seed call in `src/db/init.js`.

## Common Issues

### Database Connection
```
Error: connect ECONNREFUSED
```
Make sure `DATABASE_URL` in `.env.local` is correct and your Supabase instance is running.

### JWT Errors
```
Error: Invalid token
```
Make sure `JWT_SECRET` matches what you used to sign the token.

### Telegram Bot Not Sending
```
Telegram bot not initialized
```
Either set `TELEGRAM_BOT_TOKEN` or ignore if developing without notifications.

## Performance Testing

### Create 100 ideas
```bash
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/editorial/ideas \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_AGENT_TOKEN" \
    -d "{\"title\":\"Idea $i\",\"angle\":\"Angle $i\",\"audience_hook\":\"Hook $i\",\"tags\":[\"test\"]}"
done
```

### Load test (requires `ab` or `vegeta`)
```bash
# Using Apache Bench
ab -n 1000 -c 10 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/editorial/ideas
```

## What's Next

- [ ] Frontend UI (React/Next.js pages)
- [ ] Real YouTube analytics integration
- [ ] Partner matching algorithm
- [ ] Production calendar sync
- [ ] Bulk export to CSV
- [ ] Advanced filtering (date range, collaboration mode)

---

**Last Updated:** 2026-03-01  
**MVP Status:** ✅ API Complete, Frontend Ready to Build
