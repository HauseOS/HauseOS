# HauseOS Editorial MVP — Detailed Specification

**Status:** Ready for Automation Layer Build  
**Last Updated:** 2026-03-01  
**Owner:** Yeeling Chua (Product), Aurelius (Requirements)

---

## Executive Summary

The Editorial MVP is a **content ideation & research management platform** embedded in HauseOS. It serves as the single source of truth for video concepts, research findings, and partnership angles. Agents (Aurelius, Curie, Ogilvy) submit ideas; Yeeling & Anders review and greenlight content for production.

**Core Value:**
- Centralized brainstorm (no scattered notes)
- Clear feedback loop (agents know why ideas were accepted/rejected)
- Transparent prioritization (what's being shot next)
- Partner-ready backlog (quick response to sponsorship opportunities)

---

## Data Model

### Entity 1: Video Idea

**Purpose:** Proposed video concept with research, angles, and status tracking.

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Auto-generated |
| `title` | String (max 100) | Yes | Single-sentence video concept |
| `angle` | String (max 500) | Yes | The fresh take — why this matters NOW |
| `description` | String (max 2000) | No | Full context, research summary, key points |
| `audience_hook` | String (max 300) | Yes | What problem it solves for viewers |
| `status` | Enum | Yes | See Status Enum below |
| `priority` | Enum | No | `low` \| `medium` \| `high` (default: medium) |
| `tags` | Array<String> | No | Max 10 tags. Pre-defined list: `workflow`, `ai-tool`, `business`, `technical`, `trending`, `case-study`, `tutorial`, `review`, `shorts-ready`, `sponsored` |
| `partner_fit` | Array<String> | No | Sponsors this could work for (free text, e.g., "Zapier", "Replit") |
| `research_links` | Array<Object> | No | See Research Link structure below |
| `video_angle_notes` | String (max 1000) | No | Script angle, pacing, tone suggestions (agent-written) |
| `estimated_difficulty` | Enum | No | `simple` \| `moderate` \| `complex` (helps Anders estimate production time) |
| `estimated_production_hours` | Number | No | Best guess from agent (e.g., 2, 4, 6 hours) |
| `agent_origin` | String | Yes | Which agent submitted: `aurelius`, `curie`, `ogilvy`, `lovelace`, `eames`, `mead` |
| `created_at` | ISO 8601 | Yes | Auto-timestamp |
| `updated_at` | ISO 8601 | Yes | Auto-updated on any change |
| `submitted_by_name` | String | Yes | Display name (e.g., "Aurelius", "Curie") |
| `greenlit_at` | ISO 8601 | No | When Yeeling/Anders moved to "Greenlit" |
| `greenlit_by` | String | No | Who approved it (Yeeling or Anders username) |
| `notes` | Array<Note> | No | Feedback/comments from Yeeling/Anders. See Note structure below |
| `rejection_reason` | String (max 500) | No | If deleted/rejected, why? (optional explainer) |
| `production_status_link` | URL | No | Link to production calendar entry once greenlit |

**Research Link Structure:**
```json
{
  "title": "String (max 100) — what this link is",
  "url": "URL — where to find it",
  "source": "String — e.g., 'Twitter', 'Reddit', 'Zapier Blog'",
  "added_at": "ISO 8601 timestamp"
}
```

**Note Structure:**
```json
{
  "id": "UUID — auto-generated",
  "author": "String — who wrote it (Yeeling/Anders name)",
  "text": "String (max 1000) — the feedback",
  "created_at": "ISO 8601 timestamp",
  "type": "Enum — 'feedback' | 'approval' | 'rejection' (default: feedback)"
}
```

**Status Enum:**
- `brainstorm` — Freshly submitted, under consideration
- `under_review` — Yeeling/Anders actively evaluating
- `feedback_pending` — Agent needs to refine based on notes
- `greenlit` — Approved for production, ready for calendar
- `in_production` — Currently being shot
- `published` — Video is live on YouTube
- `rejected` — Idea was passed on (final status)
- `archived` — Old idea, keep for reference but not actionable

---

### Entity 2: Research Drop

**Purpose:** Periodic research findings from agents (Curie) on trending topics, audience signals, and partner opportunities.

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Auto-generated |
| `topic` | String (max 100) | Yes | What we researched (e.g., "Vector DB Tools Trending", "AI Agent Market Shift") |
| `summary` | String (max 500) | Yes | Executive summary of findings |
| `key_findings` | Array<String> | Yes | 3–5 bullet points (each max 200 chars) |
| `supporting_data` | String (max 2000) | No | More detailed analysis, data points, quotes |
| `source_links` | Array<Object> | No | Same structure as Research Link in Video Idea |
| `audience_data` | String (max 1000) | No | Who's interested, search trends, sentiment |
| `partner_fit` | Array<String> | No | Which sponsors should know about this |
| `urgency` | Enum | No | `low` \| `medium` \| `high` (high = time-sensitive/trending NOW) |
| `suggested_angles` | Array<String> | No | 2–4 potential video angles from this research (max 200 chars each) |
| `agent_origin` | String | Yes | Usually `curie`, but could be others |
| `created_at` | ISO 8601 | Yes | Auto-timestamp |
| `updated_at` | ISO 8601 | Yes | Auto-updated |
| `notes` | Array<Note> | No | Yeeling/Anders reactions or follow-up questions |

---

### Entity 3: Idea Reaction

**Purpose:** Simple thumbs-up/like system for Yeeling/Anders to signal interest without full comments.

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | UUID | Yes | Auto-generated |
| `idea_id` | UUID | Yes | FK to Video Idea |
| `reactor_name` | String | Yes | Who reacted (Yeeling, Anders) |
| `reaction_type` | Enum | Yes | `like` \| `love` \| `interesting` (start with just `like`) |
| `created_at` | ISO 8601 | Yes | Auto-timestamp |

---

## Screens & UI Layout

### Screen 1: Idea Board (Main View)

**URL:** `https://hause-ops.vercel.app/editorial/ideas`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ HauseOS / Editorial / Idea Board                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Filter by Status ▼] [Filter by Tag ▼] [Filter by Priority ▼]  │
│ [Search by title/angle] [Sort by Date ▼] [Clear Filters]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌─────────────────────────┐  ┌─────────────────────────┐         │
│ │ VIDEO IDEA CARD         │  │ VIDEO IDEA CARD         │         │
│ │                         │  │                         │         │
│ │ Title: AI Agents for... │  │ Title: Vector DB...     │         │
│ │ Angle: Quick overview.. │  │ Angle: When to choose.. │         │
│ │ Status: [Brainstorm]    │  │ Status: [Greenlit] ✓    │         │
│ │ Priority: HIGH          │  │ Priority: MEDIUM        │         │
│ │ Agent: Aurelius         │  │ Agent: Curie            │         │
│ │ Submitted: Mar 1        │  │ Submitted: Feb 28       │         │
│ │ Tags: workflow, ai-tool │  │ Tags: technical, tool   │         │
│ │                         │  │                         │         │
│ │ [View] [Like] [Notes]   │  │ [View] [Like] [Notes]   │         │
│ │                         │  │                         │         │
│ └─────────────────────────┘  └─────────────────────────┘         │
│                                                                   │
│ ┌─────────────────────────┐                                      │
│ │ VIDEO IDEA CARD         │                                      │
│ │ Title: Workflow Audit.. │                                      │
│ │ [View] [Like] [Notes]   │                                      │
│ └─────────────────────────┘                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**

**Filter Bar (Sticky Top)**
- Status filter dropdown: All / Brainstorm / Under Review / Feedback Pending / Greenlit / In Production / Published / Rejected
- Tag filter: Multi-select, shows count (e.g., "workflow (5)", "ai-tool (3)")
- Priority filter: All / Low / Medium / High
- Search box: Searches title + angle + description (real-time, debounced)
- Sort dropdown: Newest First / Oldest First / Highest Priority / Due Date
- Clear All button: Resets all filters

**Idea Cards (Grid View)**
- Card width: responsive, 2–3 columns on desktop, 1 column on mobile
- Card height: auto-expand with content
- Display fields:
  - **Title** (bold, large)
  - **Angle** (dimmer text, smaller)
  - **Status badge** (color-coded: brainstorm=yellow, greenlit=green, rejected=red, in_production=blue, published=green-dark)
  - **Priority badge** (optional, only if high)
  - **Agent origin** ("Submitted by: Aurelius")
  - **Date** ("Mar 1, 2026")
  - **Tags** (pill-style, small)
  - **Action buttons:** [View] [Like ♥] [Comments count]
  - **Partner fit** (if applicable): "Partners: Zapier, Replit" (small text)

**Hover State:**
- Card shadow increases
- [View] button becomes prominent
- Show "greenlit by X on DATE" if status is greenlit

---

### Screen 2: Idea Detail View

**URL:** `https://hause-ops.vercel.app/editorial/ideas/:ideaId`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ HauseOS / Editorial / Idea Detail                    [← Back]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ TITLE: AI Agents for X — When & How to Deploy                    │
│                                                                   │
│ Status: [Brainstorm] | Priority: HIGH | Submitted: Mar 1        │
│ Agent: Aurelius | Views: 2 | Likes: 1 ♥                         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ANGLE                                                             │
│ The explosion of AI agents is confusing. This video clears it:   │
│ when to use agents vs. simpler automation, real examples...      │
│                                                                   │
│ AUDIENCE HOOK                                                     │
│ Solopreneurs and small teams trying to decide if agents...       │
│                                                                   │
│ DESCRIPTION / RESEARCH SUMMARY                                   │
│ [Full text from agent]                                           │
│                                                                   │
│ RESEARCH LINKS                                                    │
│ • "AI Agent Market Report 2026" — source: Gartner               │
│ • "Agent Frameworks Compared" — source: GitHub Trending         │
│ • [+ Add Link] (Yeeling/Anders only)                            │
│                                                                   │
│ TAGS: workflow, ai-tool, business                               │
│                                                                   │
│ PARTNER FIT: Anthropic, OpenAI, Replit                          │
│                                                                   │
│ ESTIMATED PRODUCTION: 4 hours, Moderate Difficulty              │
│                                                                   │
│ VIDEO ANGLE NOTES                                                │
│ [Agent's suggestion for script/tone/pacing]                     │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ACTIONS (if Yeeling/Anders)                                      │
│ [Change Status ▼] [Add Note] [Like] [Move to Greenlit] [Delete] │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ FEEDBACK & NOTES                                                  │
│                                                                   │
│ ┌─────────────────────────────────────────┐                     │
│ │ Yeeling — "feedback"                    │                     │
│ │ Feb 28, 2:30 PM                         │                     │
│ │                                         │                     │
│ │ Love this angle. Can you research if    │                     │
│ │ Anthropic has any case studies we can   │                     │
│ │ feature?                                │                     │
│ │                                         │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                   │
│ ┌─────────────────────────────────────────┐                     │
│ │ Aurelius — "feedback"                   │                     │
│ │ Mar 1, 10:15 AM                         │                     │
│ │                                         │                     │
│ │ Updated with 2 more case studies +      │                     │
│ │ comparison chart. Ready to review again.│                     │
│ │                                         │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                   │
│ [Add Note] (Yeeling/Anders only)                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Interactions:**

1. **Status Change Dropdown:**
   - Only Yeeling/Anders can change
   - Visual progression: brainstorm → under_review → feedback_pending → greenlit → in_production → published
   - Reverse changes allowed (e.g., greenlit back to feedback_pending)
   - Rejection: separate button (marks `rejected`, captures reason)

2. **Like Button:**
   - Available to Yeeling/Anders
   - Toggles on/off
   - Shows count of likes
   - Toggle only happens for that user (e.g., Yeeling's like is independent of Anders' like)

3. **Add Note:**
   - Text input (max 1000 chars)
   - Auto-saves with author name + timestamp
   - Note types: feedback, approval, rejection (radio button or auto-detect)
   - If Yeeling marks as approval, status auto-advances to `under_review` (optional, can discuss)

4. **Move to Greenlit:**
   - Quick-action button that sets status to `greenlit`
   - Captures greenlighter name + timestamp
   - Optional modal: ask if ready for production calendar (yes/no)

5. **Delete:**
   - Only Yeeling/Anders can delete
   - Shows confirmation: "Are you sure? This cannot be undone."
   - Optional modal: "Why are you rejecting this?" (free text field, captured as `rejection_reason`)

---

### Screen 3: Research Drop Board

**URL:** `https://hause-ops.vercel.app/editorial/research`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ HauseOS / Editorial / Research Drops                             │
├─────────────────────────────────────────────────────────────────┤
│ [Filter by Urgency ▼] [Filter by Partner Fit ▼]                 │
│ [Search] [Sort by Date ▼] [Toggle View: Timeline / Cards]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 📌 TIMELINE VIEW (Default)                                       │
│                                                                   │
│ ├─ Mar 1, 2026 — 10:30 AM                                       │
│ │  Curie                                                         │
│ │  Topic: Vector DB Tools Trending (URGENT)                     │
│ │  Findings: Qdrant + Milvus gaining traction...                │
│ │  Partner Fit: Pinecone, Weaviate                              │
│ │  [View] [Notes] (2)                                           │
│ │                                                               │
│ ├─ Feb 28, 2026 — 3:15 PM                                       │
│ │  Curie                                                         │
│ │  Topic: AI Agent Market Shift                                 │
│ │  Findings: Shift from chatbots to autonomous agents...        │
│ │  Partner Fit: Anthropic, OpenAI                               │
│ │  [View] [Notes]                                               │
│ │                                                               │
│ └─ Feb 25, 2026 — 2:00 PM                                       │
│    Aurelius                                                      │
│    Topic: YouTube Audience Insights                             │
│    Findings: 55% want business workflows...                     │
│    [View] [Notes]                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Timeline Card (Expandable):**
- Topic (bold)
- Summary (first 200 chars, "...")
- Urgency badge (red for HIGH, yellow for MEDIUM, gray for LOW)
- Partner fit pills (small)
- [View] button to expand or go to detail
- [Notes count] link

**Detail View (on click [View]):**
- Full summary, key findings (bullets), supporting data
- Source links (clickable)
- Audience data breakdown
- Suggested angles (derived from research)
- Notes from Yeeling/Anders
- [Dismiss] / [Create Idea from This] button (optional, creates new video idea with research drop as reference)

---

### Screen 4: Editorial Dashboard (Stats & Overview)

**URL:** `https://hause-ops.vercel.app/editorial/dashboard`

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ HauseOS / Editorial / Dashboard                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ STATS (Last 30 Days)                                             │
│ ┌──────────┬──────────┬──────────┬──────────┐                   │
│ │ Ideas    │ Greenlit │ Published│ Rejected │                   │
│ │ Submitted│          │          │          │                   │
│ │ 12       │ 4        │ 2        │ 3        │                   │
│ └──────────┴──────────┴──────────┴──────────┘                   │
│                                                                   │
│ AGENT CONTRIBUTION                                                │
│ ┌────────────────────────────────────────┐                      │
│ │ Aurelius:  8 ideas | 2 greenlit        │                      │
│ │ Curie:     3 ideas | 2 greenlit        │                      │
│ │ Ogilvy:    1 idea  | 0 greenlit        │                      │
│ └────────────────────────────────────────┘                      │
│                                                                   │
│ IDEAS BY STATUS                                                   │
│ ┌────────────────────────────────────────┐                      │
│ │ Brainstorm: 4 ideas                    │                      │
│ │ Under Review: 2 ideas                  │                      │
│ │ Feedback Pending: 1 idea               │                      │
│ │ Greenlit: 3 ideas (→ Production Queue) │                      │
│ │ In Production: 1 idea                  │                      │
│ │ Published: 2 ideas                     │                      │
│ │ Rejected: 3 ideas                      │                      │
│ └────────────────────────────────────────┘                      │
│                                                                   │
│ AVERAGE TIME TO GREENLIT                                         │
│ ┌────────────────────────────────────────┐                      │
│ │ 4.2 days (from submission to approval) │                      │
│ └────────────────────────────────────────┘                      │
│                                                                   │
│ TRENDING TAGS                                                     │
│ ┌────────────────────────────────────────┐                      │
│ │ workflow (6) | ai-tool (5) | business (4) │                   │
│ └────────────────────────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Metrics:**
- Total ideas submitted (this month, last month)
- Greenlit rate (greenlit / submitted %)
- Published rate (published / greenlit %)
- Avg. time from submission → greenlit (days)
- Avg. time from greenlit → published (days)
- Ideas by agent (contribution breakdown)
- Ideas by status (distribution)
- Trending tags (word cloud or list)
- Partner fit frequency (which partners appear most in ideas?)

---

## User Workflows

### Workflow 1: Agent Submits a Video Idea

**Trigger:** Aurelius runs weekly brainstorm, generates 3–5 ideas

**Steps:**
1. Aurelius calls API: `POST /api/editorial/ideas`
2. Request body includes: title, angle, audience_hook, description, tags, research_links, partner_fit, estimated_production_hours, etc.
3. System creates idea with status = `brainstorm`, agent_origin = `aurelius`, created_at = now
4. System sends Telegram notification to Yeeling: "Aurelius submitted 3 new video ideas. Ready for review at [link]"
5. Yeeling sees ideas on Idea Board
6. Yeeling clicks [View] on an idea she likes
7. Yeeling clicks [Like] (toggles reaction)
8. Yeeling reads notes, changes status to `under_review`, optionally adds a note: "Love this. Can you add case study links?"
9. Aurelius gets notification (in Telegram or email): "Your idea received feedback: [Yeeling's note]"
10. Aurelius updates the idea via API or UI with additional research
11. Idea status stays `feedback_pending` until agent responds
12. Yeeling can see updated idea, clicks [Move to Greenlit]
13. Idea status = `greenlit`, greenlit_by = Yeeling, greenlit_at = now
14. Optional: auto-notify Anders or create production calendar entry

---

### Workflow 2: Curie Submits Research Findings

**Trigger:** Curie runs weekly research automation

**Steps:**
1. Curie calls API: `POST /api/editorial/research`
2. Request body: topic, summary, key_findings, source_links, audience_data, partner_fit, urgency, suggested_angles
3. System creates research drop, agent_origin = `curie`, created_at = now
4. System sends notification: "Curie posted new research: Vector DB Tools Trending [link]"
5. Yeeling reads findings on Research Board
6. Yeeling clicks [View] to see full detail
7. Optional: Yeeling clicks "Create Idea from This" button
   - Creates new Video Idea with title = suggested_angle[0], agent_origin = `curie`, research_links populated from research drop
   - Idea status = `brainstorm`, awaiting full fleshing out
8. Yeeling adds note: "Great research. Created video idea. Can you add competitor insights?"
9. Curie refines and re-submits (updates research drop or creates new one)

---

### Workflow 3: Yeeling Reviews Ideas & Greenlights for Production

**Trigger:** Weekly editorial review (e.g., Monday 9 AM SGT)

**Steps:**
1. Yeeling navigates to Idea Board
2. Yeeling filters by Status = `brainstorm` + `under_review`
3. Yeeling sees 5–6 ideas, cards display: title, angle, tags, agents, likes
4. Yeeling skims through:
   - Likes 2 ideas immediately (clicks [Like])
   - Reads full details on 3 others, adds feedback notes
   - Decides to pass on 1 (clicks [Delete], adds rejection reason: "Doesn't fit current audience")
5. Next review cycle (1 week later):
   - Aurelius has updated ideas based on feedback
   - Yeeling now moves 3–4 ideas to `greenlit`
   - Each greenlit idea gets status badge, greenlit_at timestamp, greenlit_by = Yeeling
6. Dashboard shows: "4 greenlit this month", "Time to greenlit: 4.2 days avg"
7. Optional: Yeeling exports greenlit ideas to CSV, shares with Anders for production scheduling

---

### Workflow 4: Anders Responds to Ideas (Future Integration)

**Trigger:** Idea is greenlit

**Steps:**
1. System notifies Anders: "4 ideas greenlit and ready for production scheduling"
2. Anders reviews greenlit ideas, can add notes: "This one is fun, let's prioritize it"
3. Anders links idea to production calendar (out of scope for MVP, but design for future)
4. Idea status advances to `in_production` once shooting starts
5. After publish, status = `published`, video link captured

---

## Permissions Matrix

| User | Action | Resource | Permission |
|------|--------|----------|------------|
| **Agent (Aurelius, Curie, etc.)** | Create | Video Idea | ✅ Yes |
| | Read | Video Idea (all) | ✅ Yes |
| | Update | Video Idea (own) | ✅ Yes (title, angle, research, etc.) |
| | Delete | Video Idea (own) | ❌ No |
| | View | Notes | ✅ Yes |
| | Add Note | Video Idea | ❌ No |
| | Change Status | Video Idea | ❌ No |
| **Yeeling / Anders** | Create | Video Idea | ❌ No (agents only) |
| | Read | Video Idea (all) | ✅ Yes |
| | Update | Video Idea | ❌ No direct edit (except notes) |
| | Delete | Video Idea | ✅ Yes |
| | Add Like | Video Idea | ✅ Yes |
| | Add Note | Video Idea | ✅ Yes |
| | Change Status | Video Idea | ✅ Yes (any transition) |
| | View | Dashboard | ✅ Yes |
| | Export | Greenlit Ideas | ✅ Yes (to CSV) |

**Note on Agents:**
- Agents can submit ideas and update their own, but cannot delete (prevents accidental loss)
- Agents can see feedback but cannot change status (keeps humans in control)
- Agents get notified when feedback arrives

---

## Status Transitions & Rules

### Valid Status Transitions

```
brainstorm
    ↓
under_review  ←→  feedback_pending
    ↓
greenlit (approved for production)
    ↓
in_production
    ↓
published
    
Any status → rejected (final, cannot undo)
Any status → archived (if old/stale, human decision)
```

**Rules:**
- `brainstorm` → `under_review`: Manual (Yeeling/Anders)
- `under_review` → `feedback_pending`: Manual (if notes added)
- `feedback_pending` → `under_review`: Manual (when agent updates)
- `under_review` → `greenlit`: Manual (explicit approval)
- `under_review` → `rejected`: Manual (with reason)
- `greenlit` → `in_production`: Manual (when shooting starts)
- `in_production` → `published`: Manual (when video is live, include YouTube URL)
- Any → `archived`: Manual (cleanup, keep for reference but hide from active board)

**Notification Triggers:**
- Agent submitted idea → Yeeling/Anders get Telegram
- Yeeling added feedback → Agent gets notification
- Idea greenlit → Anders notified + optional prod calendar sync
- Idea rejected → Agent gets notification with reason

---

## API Endpoints

### Video Ideas

**POST /api/editorial/ideas** (Agent)
- Create new idea
- Request: `{ title, angle, description, audience_hook, tags, partner_fit, research_links, video_angle_notes, estimated_difficulty, estimated_production_hours }`
- Response: `{ id, ...full idea object }`

**GET /api/editorial/ideas** (Anyone)
- Retrieve all ideas with filtering
- Query params: `?status=brainstorm&tag=workflow&priority=high&sortBy=date`
- Response: `{ ideas: [], total, page, pageSize }`

**GET /api/editorial/ideas/:ideaId** (Anyone)
- Retrieve single idea with full detail + notes
- Response: `{ idea }`

**PATCH /api/editorial/ideas/:ideaId** (Agent — own ideas only)
- Update own idea
- Request: `{ title, angle, description, ... }`
- Response: `{ idea }`

**PATCH /api/editorial/ideas/:ideaId/status** (Yeeling/Anders only)
- Change status
- Request: `{ status, note? }`
- Response: `{ idea }`

**DELETE /api/editorial/ideas/:ideaId** (Yeeling/Anders only)
- Delete idea (mark as rejected)
- Request: `{ rejection_reason? }`
- Response: `{ success: true }`

**POST /api/editorial/ideas/:ideaId/reactions** (Yeeling/Anders only)
- Add like/reaction
- Request: `{ reaction_type }`
- Response: `{ reaction }`

**POST /api/editorial/ideas/:ideaId/notes** (Yeeling/Anders only)
- Add feedback note
- Request: `{ text, type? }`
- Response: `{ note }`

### Research Drops

**POST /api/editorial/research** (Agent)
- Create research drop
- Request: `{ topic, summary, key_findings, source_links, audience_data, partner_fit, urgency, suggested_angles }`
- Response: `{ id, ...research drop object }`

**GET /api/editorial/research** (Anyone)
- Retrieve all research drops with filtering
- Query params: `?urgency=high&sortBy=date`
- Response: `{ drops: [], total }`

**GET /api/editorial/research/:dropId** (Anyone)
- Retrieve single research drop
- Response: `{ drop }`

**POST /api/editorial/research/:dropId/notes** (Yeeling/Anders only)
- Add feedback note
- Request: `{ text }`
- Response: `{ note }`

### Dashboard

**GET /api/editorial/dashboard/stats** (Yeeling/Anders only)
- Retrieve dashboard metrics
- Query params: `?timeRange=30days`
- Response: `{ ideas_submitted, ideas_greenlit, ideas_published, ideas_rejected, agent_contributions, status_distribution, avg_time_to_greenlit, trending_tags }`

**GET /api/editorial/ideas/export** (Yeeling/Anders only)
- Export greenlit ideas to CSV
- Query params: `?format=csv&status=greenlit`
- Response: CSV file download

---

## Integrations & Notifications

### Telegram Notifications

**When:**
- Agent submits new idea(s)
- Agent submits research drop
- Yeeling adds feedback
- Idea is greenlit
- Idea is rejected
- Idea is published

**Message Format:**
```
🎬 New Video Idea from Aurelius

Title: AI Agents for X

Angle: Quick overview of when to use agents vs. simpler automation

Status: Brainstorm | Priority: HIGH

[View in HauseOS] [Provide Feedback]
```

**Delivery:**
- To Yeeling: all notifications
- To Anders: greenlit + published + in_production
- To Agent: feedback + rejection + greenlit

---

## Edge Cases & Validation

### Input Validation

1. **Title:** Max 100 chars, min 10 chars, no special characters except hyphens/apostrophes
2. **Angle:** Max 500 chars, min 50 chars, required
3. **Audience Hook:** Max 300 chars, required
4. **Tags:** Max 10 tags per idea, must be from pre-defined list
5. **Partner Fit:** Free text, max 5 partners, comma-separated
6. **Research Links:** Max 10 links, URL must be valid HTTP/HTTPS
7. **Notes:** Max 1000 chars
8. **Estimated Hours:** 0–12 hours, decimal (e.g., 4.5)

### Error Handling

1. **Duplicate Submission:** If same title + angle submitted within 1 hour, system asks if user meant to update existing idea
2. **Broken Links:** If research link is invalid (404/timeout), system flags but allows submission (warns user)
3. **Status Transition Violations:** If user tries invalid transition (e.g., published → brainstorm), system rejects with message: "Cannot move from published to brainstorm"
4. **Permission Denied:** If agent tries to delete idea, or non-Yeeling tries to change status, system returns 403 Forbidden
5. **Offline Submissions:** For agents, if API is temporarily down, queue submission locally + retry on reconnect

### Stale Data

1. **Orphaned Ideas:** If idea has no activity for 60 days, system auto-archives (does not delete, preserves for reference)
2. **Feedback Pending Timeout:** If idea is in `feedback_pending` for >14 days with no agent update, system sends reminder notification to agent
3. **Greenlit Backlog:** If >10 ideas are greenlit but not in production, dashboard shows warning: "Production backlog is growing. Consider publishing or archiving older ideas."

---

## Success Metrics

### Adoption Metrics
- Ideas submitted per week (target: 3–5)
- Research drops submitted per week (target: 1–2)
- Feedback rate (% of ideas that get at least 1 note)

### Quality Metrics
- Greenlit rate (greenlit / submitted %, target: 30–50%)
- Time to greenlit (avg days, target: <7 days)
- Time to published (avg days from greenlit, target: 14–21 days)
- Partner fit accuracy (% of greenlit ideas that have applicable partners)

### Engagement Metrics
- Ideas liked (% of ideas with >1 like)
- Notes per idea (avg feedback count)
- Dashboard views per week (Yeeling/Anders usage)

---

## Future Enhancements (Phase 2+)

1. **Idea Templates:** Pre-built frameworks for common video types (tutorial, case study, review)
2. **Sponsor Matching:** Ogilvy can view ideas + auto-match to sponsors in CRM
3. **Production Calendar Link:** Greenlit ideas auto-create calendar entry, link back to HauseOS
4. **Video Embed:** Once published, show YouTube embed + metrics (views, watch time, likes)
5. **Audience Segmentation:** Tag ideas by audience segment (solopreneurs, founders, developers)
6. **AI Scoring:** System auto-rates ideas based on past greenlit + published performance (ML model)
7. **Bulk Operations:** Yeeling can bulk-greenlit, bulk-archive, bulk-export
8. **Comment @mentions:** `@Yeeling`, `@Anders`, `@Aurelius` in notes, triggers notifications
9. **Mobile App:** Native iOS/Android for quick review on the go
10. **Analytics Dashboard:** Post-publish metrics tied back to idea (views, engagement, subscriber impact)

---

## Rollout Plan

**Phase 1 (MVP — This Build):**
- ✅ Video Idea creation + CRUD
- ✅ Idea Board with filtering/search
- ✅ Idea Detail view
- ✅ Feedback notes + status changes
- ✅ Like reactions
- ✅ Research Drops (basic)
- ✅ Dashboard stats
- ✅ Telegram notifications (core flows)
- ✅ API for agent submissions

**Phase 1 Launch:** Ready for Automation layer build

**Phase 2 (Post-MVP):**
- Partner Matching integration
- Production Calendar link
- Anders workflow enhancements
- Video embed + publish metrics

---

## Technical Requirements for Build Team

**Must Know:**
- Idea + Research Drop + Note data structures (above)
- Status enum + transition rules
- Permission matrix (who can do what)
- API endpoints (for agent integration)
- Telegram notification events
- Dashboard metrics calculations

**Should Clarify:**
- Exact color codes for status badges (Yeeling provides brand colors)
- Telegram bot setup (token, chat IDs for Yeeling/Anders/agents)
- Database choice (PostgreSQL? Use same as HauseOS?)
- Authentication method (JWT token for agents, OAuth for Yeeling/Anders?)
- Hosting (same Vercel instance as HauseOS?)

---

**Document prepared by:** Aurelius  
**For:** Automation Layer Build Team  
**Approval:** Pending Yeeling review
