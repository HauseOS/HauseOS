import { getPool } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea_id } = req.body;

    if (!idea_id) return res.status(400).json({ error: 'idea_id is required' });

    const pool = getPool();

    const ideaResult = await pool.query('SELECT tags, partner_fit FROM video_ideas WHERE id = $1', [idea_id]);
    if (ideaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideaResult.rows[0];
    const tags = idea.tags || [];
    const partnerFit = idea.partner_fit || [];

    let query;
    let params;

    if (tags.length > 0 && partnerFit.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE category = ANY($1) OR name = ANY($2)
        ORDER BY fit_score DESC
      `;
      params = [tags, partnerFit];
    } else if (tags.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE category = ANY($1)
        ORDER BY fit_score DESC
      `;
      params = [tags];
    } else if (partnerFit.length > 0) {
      query = `
        SELECT * FROM sponsor_companies
        WHERE name = ANY($1)
        ORDER BY fit_score DESC
      `;
      params = [partnerFit];
    } else {
      return res.json({ matches: [], message: 'No tags or partner_fit data to match against' });
    }

    const result = await pool.query(query, params);
    res.json({ matches: result.rows });
  } catch (error) {
    console.error('POST /api/intelligence/match error:', error);
    res.status(500).json({ error: error.message });
  }
}
