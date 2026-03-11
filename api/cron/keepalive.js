import { getPool } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ ok: false, error: 'Database not configured' });
    }

    const result = await pool.query('SELECT 1 as ok, NOW() as server_time');
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      db_time: result.rows[0].server_time
    });
  } catch (error) {
    console.error('Keepalive error:', error.message);
    res.status(500).json({ ok: false, error: error.message, timestamp: new Date().toISOString() });
  }
}
