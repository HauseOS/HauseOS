// Sample data for testing Editorial MVP
import { getPool } from './init.js';

export async function seedEditorialData() {
  const pool = getPool();
  if (!pool) {
    console.warn('⚠️  Database not available for seeding');
    return;
  }

  try {
    // Check if data already exists
    const count = await pool.query('SELECT COUNT(*) FROM video_ideas');
    if (count.rows[0].count > 0) {
      console.log('✓ Editorial data already exists, skipping seed');
      return;
    }

    console.log('🌱 Seeding editorial data...');

    // Sample video ideas
    const idea1Result = await pool.query(`
      INSERT INTO video_ideas (
        title, angle, description, audience_hook, tags, partner_fit,
        video_angle_notes, estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, status, priority
      ) VALUES (
        'AI Agents for Solopreneurs',
        'When to use agents vs. simpler automation — practical decision framework with real examples',
        'Explore the explosion of AI agents and help solopreneurs decide whether they need one. Cover agent frameworks, when simpler automation suffices, and case studies from real businesses.',
        'Solopreneurs and small teams confused about when to adopt AI agents',
        ARRAY['workflow', 'ai-tool', 'business', 'tutorial'],
        ARRAY['Anthropic', 'OpenAI', 'Replit'],
        'Fast-paced, practical tone. Open with confusion, resolve with clear decision tree. Close with resource links.',
        'moderate',
        4.5,
        'aurelius',
        'Aurelius',
        'brainstorm',
        'high'
      )
      RETURNING *
    `);
    const idea1 = idea1Result.rows[0];
    console.log(`✓ Created idea: ${idea1.title}`);

    // Add research links to idea 1
    await pool.query(`
      INSERT INTO research_links (idea_id, title, url, source) VALUES
      ($1, 'AI Agent Market Report 2026', 'https://example.com/report', 'Gartner'),
      ($1, 'Agent Frameworks Compared', 'https://github.com/topics/agent-framework', 'GitHub'),
      ($1, 'When to Use Agents vs Automation', 'https://example.com/guide', 'Blog')
    `, [idea1.id]);

    // Sample idea 2
    const idea2Result = await pool.query(`
      INSERT INTO video_ideas (
        title, angle, description, audience_hook, tags, partner_fit,
        estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, status, priority
      ) VALUES (
        'Vector Database Showdown 2026',
        'Qdrant vs Milvus vs Pinecone — which vector DB wins and why',
        'Deep dive into the latest vector database options. Compare performance, cost, ease of use. Real benchmark data.',
        'Developers choosing a vector DB for their RAG application',
        ARRAY['technical', 'tool', 'review', 'ai-tool'],
        ARRAY['Pinecone', 'Weaviate', 'Qdrant'],
        'moderate',
        5,
        'curie',
        'Curie',
        'under_review',
        'high'
      )
      RETURNING *
    `);
    const idea2 = idea2Result.rows[0];
    console.log(`✓ Created idea: ${idea2.title}`);

    // Add feedback note to idea 2
    await pool.query(`
      INSERT INTO notes (idea_id, author, text, type) VALUES
      ($1, 'Yeeling', 'Love the angle. Can you add benchmark code we can run live?', 'feedback')
    `, [idea2.id]);

    // Sample idea 3 (greenlit)
    const idea3Result = await pool.query(`
      INSERT INTO video_ideas (
        title, angle, description, audience_hook, tags, partner_fit,
        video_angle_notes, estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, status, priority,
        greenlit_at, greenlit_by
      ) VALUES (
        'How to Build Your Own AI Tool',
        'From idea to MVP in 2 hours — clone, customize, deploy',
        'Step-by-step guide to forking an open-source AI tool and shipping your own version. No deep learning required.',
        'Indie hackers wanting to ship AI products fast',
        ARRAY['workflow', 'ai-tool', 'tutorial', 'case-study'],
        ARRAY['Vercel', 'Replit', 'GitHub'],
        'Fast, energetic tone. Code-along style. Mistakes are okay — show real development.',
        'simple',
        2,
        'aurelius',
        'Aurelius',
        'greenlit',
        'medium',
        NOW() - INTERVAL '3 days',
        'Yeeling'
      )
      RETURNING *
    `);
    const idea3 = idea3Result.rows[0];
    console.log(`✓ Created idea: ${idea3.title} (greenlit)`);

    // Add like to idea 3
    await pool.query(`
      INSERT INTO idea_reactions (idea_id, reactor_name, reaction_type) VALUES
      ($1, 'Yeeling', 'love'),
      ($1, 'Anders', 'interesting')
    `, [idea3.id]);

    // Sample research drop
    const dropResult = await pool.query(`
      INSERT INTO research_drops (
        topic, summary, key_findings, supporting_data, audience_data,
        partner_fit, urgency, suggested_angles, agent_origin
      ) VALUES (
        'Gen Z Creator Economics Shift',
        'New research shows Gen Z creators prioritizing sustainable income over viral growth',
        ARRAY[
          'Median creator income rising: +30% YoY',
          '72% prefer long-form education content',
          'Subscription > AdSense by 3:1 preference',
          'Audience wants transparent monetization'
        ],
        'Study of 5,000 creators, ages 18-28. 94% confidence level. Sources: Creator.com, Sub Stack report.',
        '18-28 age group, educators, creators, solopreneurs',
        ARRAY['Substack', 'Patreon', 'Circle'],
        'high',
        ARRAY[
          'How young creators are building sustainable income',
          'The subscription economy for educators',
          'Why short-form growth is a trap'
        ],
        'curie'
      )
      RETURNING *
    `);
    const drop = dropResult.rows[0];
    console.log(`✓ Created research drop: ${drop.topic}`);

    // Add links to research drop
    await pool.query(`
      INSERT INTO research_drop_links (research_drop_id, title, url, source) VALUES
      ($1, 'Creator Economics 2026', 'https://creator.com/report', 'Creator.com'),
      ($1, 'Substack State of the Union', 'https://substack.com/report', 'Substack')
    `, [drop.id]);

    console.log('✅ Editorial seed data complete');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
}
