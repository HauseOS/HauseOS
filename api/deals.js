import { getPool, checkApiKey } from './_db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { status, company_id } = req.query;
      const pool = getPool();

      let whereClause = '1=1';
      const params = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` AND d.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      if (company_id) {
        whereClause += ` AND d.company_id = $${paramIndex}`;
        params.push(company_id);
        paramIndex++;
      }

      const query = `
        SELECT d.*,
          sc.name as company_name,
          sc.category as company_category,
          sc.fit_score as company_fit_score,
          scon.name as contact_name,
          scon.email as contact_email,
          vi.title as idea_title
        FROM sponsor_deals d
        LEFT JOIN sponsor_companies sc ON d.company_id = sc.id
        LEFT JOIN sponsor_contacts scon ON d.contact_id = scon.id
        LEFT JOIN video_ideas vi ON d.content_idea_id = vi.id
        WHERE ${whereClause}
        ORDER BY d.created_at DESC
      `;

      const result = await pool.query(query, params);
      res.json({ deals: result.rows });
    } catch (error) {
      console.error('GET /api/deals error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    if (!checkApiKey(req, res)) return;
    try {
      const { company_id, contact_id, content_idea_id, status, deal_type, deal_value, notes } = req.body;

      if (!company_id) {
        return res.status(400).json({ error: 'company_id is required' });
      }

      const pool = getPool();
      const query = `
        INSERT INTO sponsor_deals (
          company_id, contact_id, content_idea_id, status, deal_type, deal_value, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await pool.query(query, [
        company_id, contact_id || null, content_idea_id || null,
        status || 'discovered', deal_type || null, deal_value || null, notes || null
      ]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('POST /api/deals error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
