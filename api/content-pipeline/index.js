import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    try {
      if (!pool) return res.status(500).json({ error: 'Database not available' });

      const { status, sponsor, agent } = req.query;
      let whereClause = '1=1';
      const params = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      if (sponsor) {
        whereClause += ` AND sponsor = $${paramIndex}`;
        params.push(sponsor);
        paramIndex++;
      }
      if (agent) {
        whereClause += ` AND agent = $${paramIndex}`;
        params.push(agent);
        paramIndex++;
      }

      const result = await pool.query(
        `SELECT * FROM content_pipeline WHERE ${whereClause} ORDER BY created_at DESC`,
        params
      );
      res.json({ items: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!pool) return res.status(500).json({ error: 'Database not available' });

      const { title, status, sponsor, difficulty, agent, submitted_date, production_start_date, publish_date, views, watch_hours, revenue, idea_id } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });

      const result = await pool.query(
        `INSERT INTO content_pipeline (title, status, sponsor, difficulty, agent, submitted_date, production_start_date, publish_date, views, watch_hours, revenue, idea_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [title, status || 'brainstorm', sponsor || null, difficulty || 'moderate', agent || null, submitted_date || new Date().toISOString(), production_start_date || null, publish_date || null, views || 0, watch_hours || 0, revenue || 0, idea_id || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
