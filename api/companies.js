import { getPool, checkApiKey } from './_db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { category, sort, search } = req.query;
      const pool = getPool();

      let whereClause = '1=1';
      const params = [];
      let paramIndex = 1;

      if (category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }
      if (search) {
        whereClause += ` AND (name ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      let orderBy = 'created_at DESC';
      if (sort === 'fit_score') orderBy = 'fit_score DESC';
      if (sort === 'name') orderBy = 'name ASC';
      if (sort === 'last_seen') orderBy = 'last_seen_at DESC NULLS LAST';

      const query = `SELECT * FROM sponsor_companies WHERE ${whereClause} ORDER BY ${orderBy}`;
      const result = await pool.query(query, params);

      res.json({ companies: result.rows });
    } catch (error) {
      console.error('GET /api/companies error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    if (!checkApiKey(req, res)) return;
    try {
      const { name, website, category, fit_score, funding_stage, has_partnership_page, notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;

      if (!name) return res.status(400).json({ error: 'Company name is required' });

      const pool = getPool();
      const query = `
        INSERT INTO sponsor_companies (
          name, website, category, fit_score, funding_stage, has_partnership_page,
          notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const result = await pool.query(query, [
        name, website || null, category || null, fit_score || 0,
        funding_stage || null, has_partnership_page || false,
        notes || null, source || 'manual', channels_sponsoring || null,
        sponsor_frequency || null, first_seen_at || null, last_seen_at || null
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('POST /api/companies error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
