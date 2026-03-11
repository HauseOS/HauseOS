#!/usr/bin/env node
// Run all database migrations against Supabase
// Usage: node scripts/migrate.js

import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load .env.local first, then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set. Check .env.local or .env');
  process.exit(1);
}

console.log('Connecting to database...');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Base tables from init.js
const baseTables = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'approver', 'agent')),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS work_submissions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('content', 'research', 'outreach', 'strategy', 'other')),
    author_id INTEGER REFERENCES users(id),
    content TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'shipped')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    work_id INTEGER REFERENCES work_submissions(id),
    approver_id INTEGER REFERENCES users(id),
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('approved', 'rejected', 'pending')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS agent_logs (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    work_id INTEGER REFERENCES work_submissions(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  )`
];

// Editorial tables from editorial-schema.js
const editorialTables = [
  `CREATE TABLE IF NOT EXISTS video_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    angle VARCHAR(500) NOT NULL,
    description TEXT,
    audience_hook VARCHAR(300) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'brainstorm' CHECK (status IN ('brainstorm', 'under_review', 'feedback_pending', 'greenlit', 'in_production', 'published', 'rejected', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT[],
    partner_fit TEXT[],
    video_angle_notes TEXT,
    estimated_difficulty VARCHAR(20) CHECK (estimated_difficulty IN ('simple', 'moderate', 'complex')),
    estimated_production_hours DECIMAL(5,2),
    agent_origin VARCHAR(50) NOT NULL CHECK (agent_origin IN ('aurelius', 'curie', 'ogilvy', 'lovelace', 'eames', 'mead')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    submitted_by_name VARCHAR(100) NOT NULL,
    greenlit_at TIMESTAMP,
    greenlit_by VARCHAR(100),
    rejection_reason VARCHAR(500),
    production_status_link VARCHAR(500)
  )`,
  `CREATE TABLE IF NOT EXISTS research_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
    research_drop_id UUID,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source VARCHAR(100),
    added_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    type VARCHAR(20) DEFAULT 'feedback' CHECK (type IN ('feedback', 'approval', 'rejection')),
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS idea_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES video_ideas(id) ON DELETE CASCADE,
    reactor_name VARCHAR(100) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'interesting')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(idea_id, reactor_name)
  )`,
  `CREATE TABLE IF NOT EXISTS research_drops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(100) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    key_findings TEXT[],
    supporting_data TEXT,
    audience_data TEXT,
    partner_fit TEXT[],
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    suggested_angles TEXT[],
    agent_origin VARCHAR(50) NOT NULL CHECK (agent_origin IN ('aurelius', 'curie', 'ogilvy', 'lovelace', 'eames', 'mead')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS research_drop_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_drop_id UUID NOT NULL REFERENCES research_drops(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source VARCHAR(100),
    added_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS research_drop_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_drop_id UUID NOT NULL REFERENCES research_drops(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_status ON video_ideas(status)`,
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_agent ON video_ideas(agent_origin)`,
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_created ON video_ideas(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_research_drops_urgency ON research_drops(urgency)`,
  `CREATE INDEX IF NOT EXISTS idx_research_drops_created ON research_drops(created_at DESC)`,
];

// Sponsor tables from sponsor-schema.js
const sponsorTables = [
  `CREATE TABLE IF NOT EXISTS sponsor_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    website VARCHAR(500),
    category VARCHAR(100),
    fit_score INTEGER DEFAULT 0,
    funding_stage VARCHAR(50),
    has_partnership_page BOOLEAN DEFAULT false,
    notes TEXT,
    source VARCHAR(100),
    channels_sponsoring TEXT[],
    sponsor_frequency INTEGER,
    first_seen_at TIMESTAMP,
    last_seen_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sponsor_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES sponsor_companies(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(300),
    role VARCHAR(200),
    linkedin_url VARCHAR(500),
    source VARCHAR(100),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sponsor_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES sponsor_companies(id),
    contact_id UUID REFERENCES sponsor_contacts(id),
    content_idea_id UUID REFERENCES video_ideas(id),
    status VARCHAR(50) NOT NULL DEFAULT 'discovered'
      CHECK (status IN ('discovered', 'researched', 'pitched', 'negotiating', 'confirmed', 'delivered', 'paid', 'lost')),
    deal_type VARCHAR(50),
    deal_value DECIMAL(10,2),
    pitch_sent_at TIMESTAMP,
    reply_received_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    delivered_at TIMESTAMP,
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS outreach_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES sponsor_deals(id),
    contact_id UUID REFERENCES sponsor_contacts(id),
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(300),
    body TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS content_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'brainstorm'
      CHECK (status IN ('brainstorm', 'greenlit', 'in_production', 'published')),
    sponsor VARCHAR(200),
    difficulty VARCHAR(20) DEFAULT 'moderate'
      CHECK (difficulty IN ('simple', 'moderate', 'complex')),
    agent VARCHAR(100),
    submitted_date TIMESTAMP DEFAULT NOW(),
    production_start_date TIMESTAMP,
    publish_date TIMESTAMP,
    views INTEGER DEFAULT 0,
    watch_hours INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    idea_id UUID REFERENCES video_ideas(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_companies_category ON sponsor_companies(category)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_companies_fit ON sponsor_companies(fit_score DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_deals_status ON sponsor_deals(status)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_deals_company ON sponsor_deals(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_content_pipeline_status ON content_pipeline(status)`,
];

async function runMigrations() {
  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW() as now');
    console.log('Connected:', testResult.rows[0].now);

    // Run base tables
    console.log('\n--- Base Tables ---');
    for (const query of baseTables) {
      await pool.query(query);
      console.log('  OK');
    }

    // Run editorial tables
    console.log('\n--- Editorial Tables ---');
    for (const query of editorialTables) {
      await pool.query(query);
      console.log('  OK');
    }

    // Run sponsor tables
    console.log('\n--- Sponsor Tables ---');
    for (const query of sponsorTables) {
      await pool.query(query);
      console.log('  OK');
    }

    console.log('\nAll migrations complete!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
