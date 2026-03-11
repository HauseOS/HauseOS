import { getPool } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = getPool();

    const summaryResult = await pool.query(`
      SELECT
        status,
        COUNT(*) as count,
        COALESCE(SUM(deal_value), 0) as total_value
      FROM sponsor_deals
      GROUP BY status
      ORDER BY CASE status
        WHEN 'discovered' THEN 1
        WHEN 'researched' THEN 2
        WHEN 'pitched' THEN 3
        WHEN 'negotiating' THEN 4
        WHEN 'confirmed' THEN 5
        WHEN 'delivered' THEN 6
        WHEN 'paid' THEN 7
        WHEN 'lost' THEN 8
      END
    `);

    const totalPipelineResult = await pool.query(`
      SELECT
        COALESCE(SUM(deal_value), 0) as total_pipeline_value,
        COUNT(*) as total_deals
      FROM sponsor_deals
      WHERE status NOT IN ('lost', 'paid')
    `);

    const thisMonthResult = await pool.query(`
      SELECT COUNT(*) as deals_this_month
      FROM sponsor_deals
      WHERE created_at >= date_trunc('month', CURRENT_DATE)
    `);

    res.json({
      stages: summaryResult.rows,
      total_pipeline_value: parseFloat(totalPipelineResult.rows[0].total_pipeline_value),
      total_active_deals: parseInt(totalPipelineResult.rows[0].total_deals),
      deals_this_month: parseInt(thisMonthResult.rows[0].deals_this_month)
    });
  } catch (error) {
    console.error('GET /api/deals/pipeline error:', error);
    res.status(500).json({ error: error.message });
  }
}
