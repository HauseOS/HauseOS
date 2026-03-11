import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const pool = getPool();

      const companyResult = await pool.query('SELECT * FROM sponsor_companies WHERE id = $1', [id]);
      if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const company = companyResult.rows[0];

      const contactsResult = await pool.query('SELECT * FROM sponsor_contacts WHERE company_id = $1 ORDER BY created_at DESC', [id]);
      company.contacts = contactsResult.rows;

      const dealsResult = await pool.query(
        `SELECT d.*, vi.title as idea_title FROM sponsor_deals d
         LEFT JOIN video_ideas vi ON d.content_idea_id = vi.id
         WHERE d.company_id = $1 ORDER BY d.created_at DESC`,
        [id]
      );
      company.deals = dealsResult.rows;

      res.json(company);
    } catch (error) {
      console.error('GET /api/companies/[id] error:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { name, website, category, fit_score, funding_stage, has_partnership_page, notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;

      const pool = getPool();
      const query = `
        UPDATE sponsor_companies SET
          name = COALESCE($1, name),
          website = COALESCE($2, website),
          category = COALESCE($3, category),
          fit_score = COALESCE($4, fit_score),
          funding_stage = COALESCE($5, funding_stage),
          has_partnership_page = COALESCE($6, has_partnership_page),
          notes = COALESCE($7, notes),
          source = COALESCE($8, source),
          channels_sponsoring = COALESCE($9, channels_sponsoring),
          sponsor_frequency = COALESCE($10, sponsor_frequency),
          first_seen_at = COALESCE($11, first_seen_at),
          last_seen_at = COALESCE($12, last_seen_at),
          updated_at = NOW()
        WHERE id = $13
        RETURNING *
      `;

      const result = await pool.query(query, [
        name, website, category, fit_score, funding_stage, has_partnership_page,
        notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('PATCH /api/companies/[id] error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
