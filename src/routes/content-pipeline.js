import express from 'express';
import { getPool } from '../db/init.js';

const router = express.Router();

// GET /api/content-pipeline — List all pipeline items
router.get('/', async (req, res) => {
  try {
    const { status, sponsor, agent } = req.query;
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

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

    const query = `
      SELECT * FROM content_pipeline
      WHERE ${whereClause}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, params);
    res.json({ items: result.rows });
  } catch (error) {
    console.error('GET /content-pipeline error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/content-pipeline/:id — Get single item
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const result = await pool.query('SELECT * FROM content_pipeline WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pipeline item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('GET /content-pipeline/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/content-pipeline — Create pipeline item
router.post('/', async (req, res) => {
  try {
    const { title, status, sponsor, difficulty, agent, submitted_date, production_start_date, publish_date, views, watch_hours, revenue, idea_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      INSERT INTO content_pipeline (
        title, status, sponsor, difficulty, agent, submitted_date,
        production_start_date, publish_date, views, watch_hours, revenue, idea_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await pool.query(query, [
      title, status || 'brainstorm', sponsor || null, difficulty || 'moderate',
      agent || null, submitted_date || new Date().toISOString(),
      production_start_date || null, publish_date || null,
      views || 0, watch_hours || 0, revenue || 0, idea_id || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST /content-pipeline error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/content-pipeline/:id — Update pipeline item
router.patch('/:id', async (req, res) => {
  try {
    const { title, status, sponsor, difficulty, agent, production_start_date, publish_date, views, watch_hours, revenue } = req.body;

    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const query = `
      UPDATE content_pipeline SET
        title = COALESCE($1, title),
        status = COALESCE($2, status),
        sponsor = COALESCE($3, sponsor),
        difficulty = COALESCE($4, difficulty),
        agent = COALESCE($5, agent),
        production_start_date = COALESCE($6, production_start_date),
        publish_date = COALESCE($7, publish_date),
        views = COALESCE($8, views),
        watch_hours = COALESCE($9, watch_hours),
        revenue = COALESCE($10, revenue),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(query, [
      title, status, sponsor, difficulty, agent,
      production_start_date, publish_date, views, watch_hours, revenue,
      req.params.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pipeline item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH /content-pipeline/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/content-pipeline/:id — Delete pipeline item
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(500).json({ error: 'Database not available' });

    const result = await pool.query('DELETE FROM content_pipeline WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pipeline item not found' });
    }
    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('DELETE /content-pipeline/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
