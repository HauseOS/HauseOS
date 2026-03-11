import { getPool, checkApiKey } from './_db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { company_id } = req.query;
      const pool = getPool();

      let query = `
        SELECT c.*, sc.name as company_name
        FROM sponsor_contacts c
        LEFT JOIN sponsor_companies sc ON c.company_id = sc.id
      `;
      const params = [];

      if (company_id) {
        query += ' WHERE c.company_id = $1';
        params.push(company_id);
      }

      query += ' ORDER BY c.created_at DESC';
      const result = await pool.query(query, params);

      res.json({ contacts: result.rows });
    } catch (error) {
      console.error('GET /api/contacts error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    if (!checkApiKey(req, res)) return;
    try {
      const { company_id, name, email, role, linkedin_url, source, verified } = req.body;

      if (!company_id || !name) {
        return res.status(400).json({ error: 'company_id and name are required' });
      }

      const pool = getPool();
      const query = `
        INSERT INTO sponsor_contacts (company_id, name, email, role, linkedin_url, source, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await pool.query(query, [
        company_id, name, email || null, role || null,
        linkedin_url || null, source || 'manual', verified || false
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('POST /api/contacts error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
