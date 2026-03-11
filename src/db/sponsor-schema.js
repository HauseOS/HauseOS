// Sponsor CRM Schema
// Tables: sponsor_companies, sponsor_contacts, sponsor_deals, outreach_log

export const sponsorTables = [
  // Sponsor Companies
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

  // Sponsor Contacts
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

  // Sponsor Deals
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

  // Outreach Log
  `CREATE TABLE IF NOT EXISTS outreach_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES sponsor_deals(id),
    contact_id UUID REFERENCES sponsor_contacts(id),
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(300),
    body TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
  )`,

  // Content Pipeline
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

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_sponsor_companies_category ON sponsor_companies(category)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_companies_fit ON sponsor_companies(fit_score DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_deals_status ON sponsor_deals(status)`,
  `CREATE INDEX IF NOT EXISTS idx_sponsor_deals_company ON sponsor_deals(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_content_pipeline_status ON content_pipeline(status)`,
];

export async function initSponsorSchema(pool) {
  if (!pool) {
    console.warn('⚠️  Database pool not available. Skipping sponsor schema.');
    return;
  }

  for (const query of sponsorTables) {
    try {
      await pool.query(query);
      console.log('✓ Sponsor schema table/index created/verified');
    } catch (error) {
      console.error('Sponsor schema error:', error.message);
    }
  }
}
