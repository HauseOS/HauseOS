import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    try {
      if (!pool) return res.status(500).json({ error: 'Database not available' });

      const { status, tag, priority, search, sortBy = 'date', page = 1, limit = 20 } = req.query;

      let whereClause = '1=1';
      const params = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      if (tag) {
        whereClause += ` AND tags @> ARRAY[$${paramIndex}]`;
        params.push(tag);
        paramIndex++;
      }
      if (priority) {
        whereClause += ` AND priority = $${paramIndex}`;
        params.push(priority);
        paramIndex++;
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex} OR angle ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      let orderBy = 'created_at DESC';
      if (sortBy === 'priority') orderBy = "CASE WHEN priority='high' THEN 0 WHEN priority='medium' THEN 1 ELSE 2 END";
      if (sortBy === 'oldest') orderBy = 'created_at ASC';

      const offset = (page - 1) * limit;

      const query = `
        SELECT * FROM video_ideas
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM video_ideas WHERE ${whereClause}`,
        params.slice(0, -2)
      );

      res.json({
        ideas: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error('GET /editorial/ideas error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!pool) return res.status(500).json({ error: 'Database not available' });

      const {
        title, angle, description, audience_hook, tags, partner_fit,
        video_angle_notes, estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, priority, research_links
      } = req.body;

      if (!title || !angle || !audience_hook) {
        return res.status(400).json({ error: 'Missing required fields: title, angle, audience_hook' });
      }
      if (!agent_origin || !submitted_by_name) {
        return res.status(400).json({ error: 'Missing required fields: agent_origin, submitted_by_name' });
      }

      const query = `
        INSERT INTO video_ideas (
          title, angle, description, audience_hook, tags, partner_fit,
          video_angle_notes, estimated_difficulty, estimated_production_hours,
          agent_origin, submitted_by_name, status, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'brainstorm', $12)
        RETURNING *
      `;

      const result = await pool.query(query, [
        title, angle, description || null, audience_hook,
        tags || null, partner_fit || null, video_angle_notes || null,
        estimated_difficulty || null, estimated_production_hours || null,
        agent_origin, submitted_by_name, priority || 'medium'
      ]);

      const idea = result.rows[0];

      // Insert research links if provided
      if (research_links && research_links.length > 0) {
        for (const link of research_links) {
          await pool.query(
            'INSERT INTO research_links (idea_id, title, url, source) VALUES ($1, $2, $3, $4)',
            [idea.id, link.title, link.url, link.source || null]
          );
        }
      }

      res.status(201).json(idea);
    } catch (error) {
      console.error('POST /editorial/ideas error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
