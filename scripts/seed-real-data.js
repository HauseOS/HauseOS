/**
 * HauseOS Real Data Seed Script
 * Populates the platform with real ideas, research, and sponsor intel
 * from Hause Collective sessions (Mar 2026)
 *
 * Usage: node scripts/seed-real-data.js
 * Requires: API to be live at HAUSEOS_API_URL
 */

import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const API_BASE = process.env.HAUSEOS_API_URL || 'https://hauseos.vercel.app';

// ─── VIDEO IDEAS ────────────────────────────────────────────────────────────

const videoIdeas = [
  {
    title: "Building a Media Company with AI",
    angle: "How Hause Collective grew from 0 to 35K subscribers in 5 months using AI in every layer",
    description: "Full behind-the-scenes breakdown: content strategy, production workflow, automation stack, and what AI actually does (and doesn't do) for a 2-person media team. This is our story — most credible thing we can make.",
    audience_hook: "Creators and founders who want to build a media operation without a big team",
    status: "brainstorm",
    priority: "high",
    tags: ["ai-workflow", "business", "case-study", "creator-economy"],
    partner_fit: ["Notion", "Cursor", "Claude"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 8
  },
  {
    title: "AI Agents for Solopreneurs",
    angle: "When to use agents vs simpler automation — a practical decision framework with real examples",
    description: "Most content about AI agents is either hype or enterprise-scale. This fills the gap: a creator/solopreneur perspective on when agents actually save time vs when a simple workflow does the job. Includes real examples from our own stack.",
    audience_hook: "Business builders who are overwhelmed by AI options and need a clear framework",
    status: "under_review",
    priority: "high",
    tags: ["ai-agents", "workflow", "business", "automation"],
    partner_fit: ["Zapier", "Make.com", "Claude", "OpenAI"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 6
  },
  {
    title: "How to Build Your Own AI Tool (Idea to MVP in 2 Hours)",
    angle: "Clone, customize, deploy — no deep coding required, just AI + the right stack",
    description: "Live build video: take a real problem, design a simple AI-powered tool, deploy it publicly in one session. Shows the full workflow: prompt design → Next.js scaffold → Vercel deploy → real usage. Greenlit concept — high production priority.",
    audience_hook: "Builders who want to ship AI products but feel blocked by the technical gap",
    status: "greenlit",
    priority: "high",
    tags: ["tutorial", "ai-tool", "build", "workflow"],
    partner_fit: ["Vercel", "Cursor", "Anthropic", "Replit"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 5
  },
  {
    title: "HauseOS: We Built Our Own Agent Operating System",
    angle: "Full walkthrough of HauseOS — how we replaced scattered tools with one AI-powered command centre",
    description: "This is the meta-video: showing the audience what runs Hause behind the scenes. Tour of HauseOS (what they're seeing on screen), the agent team (Aurelius, Curie, Ogilvy), how ideas flow from brainstorm to greenlight to production. Doubles as a product showcase.",
    audience_hook: "Creators curious about how AI-powered teams actually operate day-to-day",
    status: "brainstorm",
    priority: "high",
    tags: ["ai-workflow", "business", "case-study", "hause-os"],
    partner_fit: ["Anthropic", "Vercel", "Supabase"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 10
  },
  {
    title: "Vector Database Showdown 2026",
    angle: "Qdrant vs Milvus vs Pinecone — which actually wins for real-world AI apps",
    description: "Practical comparison from a builder's perspective. Not benchmarks for benchmark's sake — actual use cases: RAG, semantic search, image similarity. Which one is easiest to set up? Which scales without killing the budget? Which one would Hause actually use?",
    audience_hook: "Developers building AI apps who need to choose a vector DB and don't want to waste a week evaluating",
    status: "brainstorm",
    priority: "medium",
    tags: ["technical", "ai-tool", "review", "database"],
    partner_fit: ["Qdrant", "Pinecone", "Milvus"],
    agent_origin: "curie",
    submitted_by_name: "Curie",
    estimated_production_hours: 7
  },
  {
    title: "Prompt Engineering in 2026: What Actually Works",
    angle: "Experiments + real data on which prompt techniques actually improve output quality",
    description: "Not theory — actual tests. Side-by-side comparisons of chain-of-thought, few-shot, zero-shot, role prompting across different tasks (writing, coding, analysis). What the research says vs what works in practice. Includes our own Hause prompt patterns.",
    audience_hook: "Anyone using AI who wants better outputs without constantly tweaking",
    status: "feedback_pending",
    priority: "medium",
    tags: ["ai-tool", "tutorial", "workflow", "technical"],
    partner_fit: ["OpenAI", "Anthropic", "Cursor"],
    agent_origin: "curie",
    submitted_by_name: "Curie",
    estimated_production_hours: 5
  },
  {
    title: "MiniMax Video Generation: Full Creator Walkthrough",
    angle: "What MiniMax can actually do for video creators in 2026 — honest review with real project",
    description: "Sponsored content angle (MiniMax deal in pipeline). Structure: genuine exploration of the tool in a real creative project. Show the good, acknowledge the limitations, demonstrate actual workflow integration. Partner fit: dedicated video.",
    audience_hook: "Creators who want to add AI video generation to their workflow",
    status: "brainstorm",
    priority: "medium",
    tags: ["sponsored", "ai-video", "review", "tool"],
    partner_fit: ["MiniMax"],
    agent_origin: "ogilvy",
    submitted_by_name: "Ogilvy",
    estimated_production_hours: 6
  },
  {
    title: "Lovart AI: Design for the AI Era",
    angle: "First look at Lovart — the creative platform built specifically for AI-era designers",
    description: "Sponsored content angle (Lovart deal confirmed at $1,300). Deep dive into what Lovart offers that existing design tools don't. Show real workflow: concept → generation → refinement → export. Honest review format with genuine use case.",
    audience_hook: "Designers and creative professionals who want to integrate AI into their creative process",
    status: "in_production",
    priority: "high",
    tags: ["sponsored", "design", "ai-tool", "review"],
    partner_fit: ["Lovart"],
    agent_origin: "ogilvy",
    submitted_by_name: "Ogilvy",
    estimated_production_hours: 5
  },
  {
    title: "5 AI Tools That Changed How We Create (2026 Stack)",
    angle: "The real Hause toolkit — what we actually use, why we chose it, what it replaced",
    description: "Not a 'best AI tools' listicle. This is our specific stack with context: what problem each tool solves, what we tried before it, and what makes it worth paying for. Ties back to HauseResource and affiliate opportunities.",
    audience_hook: "Creators building a lean AI-powered workflow who want real recommendations, not sponsored lists",
    status: "brainstorm",
    priority: "medium",
    tags: ["ai-tool", "workflow", "business", "tutorial"],
    partner_fit: ["Notion", "Cursor", "Claude", "Vercel", "Supabase"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 4
  },
  {
    title: "How to Pick Your AI Stack in 2026",
    angle: "A decision framework for creators who are drowning in AI tool options",
    description: "Audience research shows 57% want business workflow content, 52% want real project examples. This hits both. Framework: what problem are you solving → what category of tool → evaluation criteria → total cost of ownership. Practical and evergreen.",
    audience_hook: "Creators and builders overwhelmed by the pace of AI releases who need a clear way to evaluate",
    status: "brainstorm",
    priority: "medium",
    tags: ["ai-workflow", "business", "tutorial", "decision-making"],
    partner_fit: ["Notion", "Zapier", "Claude"],
    agent_origin: "curie",
    submitted_by_name: "Curie",
    estimated_production_hours: 5
  },
  {
    title: "No-Code AI: What's Actually Possible in 2026",
    angle: "Real capability audit — what you can build without writing a line of code",
    description: "Demystify no-code AI for creators and entrepreneurs. Categories: automation (Zapier/Make), content generation (native AI tools), app building (Bubble/Glide with AI), and agent orchestration (accessible no-code flows). Show actual builds, not demos.",
    audience_hook: "Non-technical creators who want to build AI-powered products without depending on a developer",
    status: "brainstorm",
    priority: "high",
    tags: ["no-code", "ai-tool", "tutorial", "workflow"],
    partner_fit: ["Zapier", "Make.com", "Bubble", "Glide"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 6
  },
  {
    title: "The Creator's Guide to AI Automation",
    angle: "Full workflow walkthrough: how to automate the boring parts of content creation",
    description: "Business workflow content — highest audience demand (57%). End-to-end walkthrough: research → scripting → production scheduling → distribution → analytics. Show what we automate at Hause vs what requires human judgment. Real tool stack, real examples.",
    audience_hook: "Content creators who spend too much time on admin and not enough on creative work",
    status: "brainstorm",
    priority: "medium",
    tags: ["workflow", "automation", "business", "ai-tool"],
    partner_fit: ["Notion", "Zapier", "Make.com", "Claude"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius",
    estimated_production_hours: 7
  }
];

// ─── RESEARCH DROPS ──────────────────────────────────────────────────────────

const researchDrops = [
  {
    title: "YouTube Channel Deep Dive — Hause Collective Mar 2026",
    summary: "Full audit of channel performance. 35,649 subscribers, 613,015 total views, 6,204 watch hours, 5 months old (Sept 2024 launch). Top markets: India (92K views), Bangladesh (35K), Nepal (21K). Key audience insight: 57% want business workflow content, 52% want real project examples. Growth trajectory suggests 50K milestone in 8–12 weeks.",
    source_url: "https://studio.youtube.com",
    urgency: "low",
    tags: ["analytics", "youtube", "audience"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius"
  },
  {
    title: "Competitor Channel Analysis — Educational AI/Creator Space",
    summary: "Comparable creators analysis: Fireship (1M+ subs, enterprise sponsors, $5K+ rates), Web Dev Simplified (~500K, affiliate model), Code with Ania (~500K, courses + sponsorships). Key insight: educational channels command $2K–$10K+ per sponsorship. Integrated tutorials (product in real workflow) outperform ad-reads. 1–2 sponsored videos per month is the sustainable sweet spot. Hause's niche advantage: AI × creator economy is underserved at our production quality level.",
    source_url: null,
    urgency: "low",
    tags: ["competitive", "sponsorship", "strategy"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius"
  },
  {
    title: "Sponsor Tier Research — AI/Creator Tool Companies",
    summary: "Tier 1 targets (high audience match): Figma, Framer, Replit, Notion, OpenAI/ChatGPT, Cursor, Anthropic. Tier 2 (moderate match): Zapier, Make.com, Stripe, GitHub, Linear, Airtable. Tier 3 stretch: ConvertKit, Substack, Gumroad, Loom. Risk factors: some require 50K+ minimum subscribers, channel age may be a factor for enterprise sponsors. Recommended approach: lead with content-fit narrative, not subscriber count.",
    source_url: null,
    urgency: "medium",
    tags: ["sponsorship", "research", "pipeline"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius"
  },
  {
    title: "Outbound Strategy Audit — Token Cost & Quality Analysis",
    summary: "Full review of cold outreach pipeline (Mar 2026). 204 entries processed across 3 sessions. Each email costs 15–30K tokens on Sonnet/Opus. 58 emails rejected by filter agent (em-dash + template issues). 80% of Baserow database is enterprise/niche — wrong fit. Cold outreach converts at low values ($500–1K indie founders). Conclusion: Mode A (content-first, sponsor-second) produces higher deal value and better content. Mode B (cold outreach) continues as low-cost background process only.",
    source_url: null,
    urgency: "medium",
    tags: ["outbound", "strategy", "analysis"],
    agent_origin: "aurelius",
    submitted_by_name: "Aurelius"
  },
  {
    title: "HauseResource Affiliate Analysis — 20 Tools, 4 Categories",
    summary: "Full affiliate programme audit for hause-resource.vercel.app. 20 tools across 4 categories. Projection: $1.7–2.6K/month by month 6 with organic traffic. Key tools with confirmed affiliate programmes: Notion (up to $16/referral), Framer ($9/mo recurring), Webflow (50% first year), Linear, Airtable. Risk: site needs content strategy, not just a link directory, to drive organic traffic. Recommended pivot: organise by workflow problem, not tool category.",
    source_url: "https://hause-resource.vercel.app",
    urgency: "low",
    tags: ["affiliate", "hause-resource", "revenue", "analysis"],
    agent_origin: "curie",
    submitted_by_name: "Curie"
  },
  {
    title: "Sponsorship Platform Comparison — Sponsorshipped vs Sponsorship.so",
    summary: "Evaluated two sponsor discovery platforms. Sponsorshipped ($99/mo): larger database, good for cold outreach, shows who's actively spending. Sponsorship.so ($89/mo): better filtering, more SEA representation. SponsorRadar (beta): free tier available. Conclusion: may not need either — Mode A (content-first outreach) and direct Baserow CRM approach is more cost-effective for current stage. Trial emails drafted but not sent pending Yeeling approval.",
    source_url: null,
    urgency: "low",
    tags: ["sponsorship", "tools", "outbound", "research"],
    agent_origin: "ogilvy",
    submitted_by_name: "Ogilvy"
  }
];

// ─── SEED FUNCTIONS ──────────────────────────────────────────────────────────

async function seedIdeas() {
  console.log(`\n📝 Seeding ${videoIdeas.length} video ideas...`);
  let success = 0;
  let failed = 0;

  for (const idea of videoIdeas) {
    try {
      const res = await fetch(`${API_BASE}/api/editorial/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idea)
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`  ✅ "${idea.title}" (id: ${data.id || 'ok'})`);
        success++;
      } else {
        const err = await res.text();
        console.log(`  ❌ "${idea.title}": ${res.status} — ${err}`);
        failed++;
      }
    } catch (e) {
      console.log(`  ❌ "${idea.title}": ${e.message}`);
      failed++;
    }
  }

  console.log(`\n  Ideas: ${success} seeded, ${failed} failed`);
}

async function seedResearch() {
  console.log(`\n🔬 Seeding ${researchDrops.length} research drops (via Supabase client)...`);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  // Map seed data fields to DB schema (title→topic, summary→summary)
  const rows = researchDrops.map(d => ({
    topic: d.title,
    summary: d.summary.substring(0, 500),
    key_findings: d.tags || null,
    partner_fit: null,
    urgency: d.urgency || 'low',
    agent_origin: d.agent_origin,
  }));

  const { data, error } = await supabase.from('research_drops').insert(rows).select();
  if (error) {
    console.log(`  ❌ Research seed failed: ${error.message}`);
  } else {
    console.log(`  ✅ ${data.length} research drops seeded`);
  }
}

async function verifyAPI() {
  console.log('\n🔍 Verifying API is live...');
  try {
    const res = await fetch(`${API_BASE}/api/editorial/ideas`);
    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅ API is live — ${data.total ?? 0} ideas currently in DB`);
      return true;
    } else {
      console.log(`  ❌ API returned ${res.status}`);
      return false;
    }
  } catch (e) {
    console.log(`  ❌ API not reachable: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🌱 HauseOS Real Data Seed');
  console.log(`   Target: ${API_BASE}`);
  console.log(`   Date: ${new Date().toISOString()}\n`);

  const apiLive = await verifyAPI();
  if (!apiLive) {
    console.log('\n⛔ API is not available. Run this script after Phase 1 (DB + redeploy) is complete.');
    console.log('   Check: curl ' + API_BASE + '/api/editorial/dashboard');
    process.exit(1);
  }

  await seedIdeas();
  await seedResearch();

  console.log('\n✅ Seed complete. Visit https://hauseos.vercel.app/editorial to see the data.');
}

main().catch(console.error);
