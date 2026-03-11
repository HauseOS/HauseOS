import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const pool = getPool();
  if (!pool) return res.status(500).json({ error: 'Database not available' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM content_pipeline WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { title, status, sponsor, difficulty, agent, production_start_date, publish_date, views, watch_hours, revenue } = req.body;
      const result = await pool.query(
        `UPDATE content_pipeline SET
          title = COALESCE($1, title), status = COALESCE($2, status), sponsor = COALESCE($3, sponsor),
          difficulty = COALESCE($4, difficulty), agent = COALESCE($5, agent),
          production_start_date = COALESCE($6, production_start_date), publish_date = COALESCE($7, publish_date),
          views = COALESCE($8, views), watch_hours = COALESCE($9, watch_hours), revenue = COALESCE($10, revenue),
          updated_at = NOW()
        WHERE id = $11 RETURNING *`,
        [title, status, sponsor, difficulty, agent, production_start_date, publish_date, views, watch_hours, revenue, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM content_pipeline WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true, item: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
