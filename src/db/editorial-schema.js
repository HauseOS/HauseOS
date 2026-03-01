// Editorial MVP Schema
// Defines all tables for video ideas, research drops, notes, and reactions

export const editorialTables = [
  // Video Ideas
  `CREATE TABLE IF NOT EXISTS video_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    angle VARCHAR(500) NOT NULL,
    description TEXT,
    audience_hook VARCHAR(300) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'brainstorm' CHECK (status IN ('brainstorm', 'under_review', 'feedback_pending', 'greenlit', 'in_production', 'published', 'rejected', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT[], -- Array of tags
    partner_fit TEXT[], -- Array of partner names
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

  // Research Links (for video ideas)
  `CREATE TABLE IF NOT EXISTS research_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
    research_drop_id UUID,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source VARCHAR(100),
    added_at TIMESTAMP DEFAULT NOW()
  )`,

  // Notes (feedback on video ideas)
  `CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES video_ideas(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    type VARCHAR(20) DEFAULT 'feedback' CHECK (type IN ('feedback', 'approval', 'rejection')),
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Idea Reactions (likes)
  `CREATE TABLE IF NOT EXISTS idea_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES video_ideas(id) ON DELETE CASCADE,
    reactor_name VARCHAR(100) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'interesting')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(idea_id, reactor_name) -- One reaction per user per idea
  )`,

  // Research Drops
  `CREATE TABLE IF NOT EXISTS research_drops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(100) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    key_findings TEXT[], -- Array of findings
    supporting_data TEXT,
    audience_data TEXT,
    partner_fit TEXT[], -- Array of partner names
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
    suggested_angles TEXT[], -- Array of angle suggestions
    agent_origin VARCHAR(50) NOT NULL CHECK (agent_origin IN ('aurelius', 'curie', 'ogilvy', 'lovelace', 'eames', 'mead')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // Research Drop Links
  `CREATE TABLE IF NOT EXISTS research_drop_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_drop_id UUID NOT NULL REFERENCES research_drops(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source VARCHAR(100),
    added_at TIMESTAMP DEFAULT NOW()
  )`,

  // Research Drop Notes
  `CREATE TABLE IF NOT EXISTS research_drop_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_drop_id UUID NOT NULL REFERENCES research_drops(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create indexes for performance
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_status ON video_ideas(status)`,
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_agent ON video_ideas(agent_origin)`,
  `CREATE INDEX IF NOT EXISTS idx_video_ideas_created ON video_ideas(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_research_drops_urgency ON research_drops(urgency)`,
  `CREATE INDEX IF NOT EXISTS idx_research_drops_created ON research_drops(created_at DESC)`,
];

export async function initEditorialSchema(pool) {
  if (!pool) {
    console.warn('⚠️  Database pool not available. Skipping editorial schema.');
    return;
  }

  for (const query of editorialTables) {
    try {
      await pool.query(query);
      console.log('✓ Editorial schema table/index created/verified');
    } catch (error) {
      console.error('Editorial schema error:', error.message);
    }
  }
}
