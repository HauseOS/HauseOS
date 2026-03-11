# HauseOS Agent API Reference

**Base URL:** `https://hauseos.vercel.app`

## Editorial

### GET /api/editorial/ideas
List all video ideas with filtering and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter: brainstorm, under_review, feedback_pending, greenlit, in_production, published, rejected, archived |
| tag | string | Filter by tag (array contains) |
| priority | string | Filter: low, medium, high |
| search | string | Search title, angle, description |
| sortBy | string | date (default), priority, oldest |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

```bash
curl https://hauseos.vercel.app/api/editorial/ideas
curl "https://hauseos.vercel.app/api/editorial/ideas?status=brainstorm&priority=high"
```

### POST /api/editorial/ideas
Create a new video idea.

**Required fields:** title, angle, audience_hook, agent_origin, submitted_by_name

```bash
curl -X POST https://hauseos.vercel.app/api/editorial/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Agents for Solopreneurs",
    "angle": "When to use agents vs. simpler automation — practical decision framework with real examples from businesses",
    "audience_hook": "Solopreneurs confused about when to adopt AI agents",
    "agent_origin": "aurelius",
    "submitted_by_name": "Aurelius",
    "tags": ["workflow", "ai-tool", "business"],
    "partner_fit": ["Anthropic", "OpenAI"],
    "priority": "high",
    "estimated_difficulty": "moderate",
    "estimated_production_hours": 4.5,
    "research_links": [
      {"title": "AI Agent Market Report", "url": "https://example.com/report", "source": "Gartner"}
    ]
  }'
```

---

## Content Pipeline

### GET /api/content-pipeline
List all content pipeline items.

**Query Parameters:** status, sponsor, agent

```bash
curl https://hauseos.vercel.app/api/content-pipeline
curl "https://hauseos.vercel.app/api/content-pipeline?status=in_production"
```

### POST /api/content-pipeline
Create a pipeline item.

```bash
curl -X POST https://hauseos.vercel.app/api/content-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vector DB Showdown 2026",
    "status": "brainstorm",
    "sponsor": "Pinecone",
    "difficulty": "moderate",
    "agent": "Curie"
  }'
```

### PATCH /api/content-pipeline/[id]
Update a pipeline item.

```bash
curl -X PATCH https://hauseos.vercel.app/api/content-pipeline/UUID_HERE \
  -H "Content-Type: application/json" \
  -d '{"status": "greenlit"}'
```

---

## Partnerships / Sponsors

### GET /api/companies
List sponsor companies.

**Query Parameters:** category, sort (fit_score, name, last_seen), search

```bash
curl https://hauseos.vercel.app/api/companies
curl "https://hauseos.vercel.app/api/companies?sort=fit_score"
```

### POST /api/companies
Create a sponsor company. Requires `X-API-Key` header if HAUSECAMP_API_KEY is set.

```bash
curl -X POST https://hauseos.vercel.app/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anthropic",
    "website": "https://anthropic.com",
    "category": "AI",
    "fit_score": 5,
    "source": "agent"
  }'
```

### GET /api/companies/[id]
Get single company with contacts and deals.

### GET /api/contacts
List contacts. Optional: `?company_id=UUID`

### POST /api/contacts
Add contact. Required: company_id, name.

### GET /api/deals
List deals. Optional: `?status=pitched&company_id=UUID`

### GET /api/deals/pipeline
Pipeline summary grouped by status with totals.

### POST /api/deals
Create deal. Requires `X-API-Key`. Required: company_id.

### PATCH /api/deals/[id]
Update deal status, value, dates.

### POST /api/intelligence/match
Match idea to sponsors by tags/partner_fit. Required: idea_id.

---

## System

### GET /api/cron/keepalive
DB keepalive ping. Runs daily at 1am UTC via Vercel cron.

```bash
curl https://hauseos.vercel.app/api/cron/keepalive
```

### GET /api
Health check.

```bash
curl https://hauseos.vercel.app/api
```

---

## Agent Origins
Valid agent_origin values: `aurelius`, `curie`, `ogilvy`, `lovelace`, `eames`, `mead`
