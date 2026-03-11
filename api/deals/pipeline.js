import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  try {
    const { data: deals, error } = await supabase
      .from('sponsor_deals')
      .select('status, deal_value, created_at');

    if (error) throw error;

    const STATUS_ORDER = ['discovered','researched','pitched','negotiating','confirmed','delivered','paid','lost'];

    // Aggregate by status
    const stageMap = {};
    for (const d of deals || []) {
      if (!stageMap[d.status]) stageMap[d.status] = { status: d.status, count: 0, total_value: 0 };
      stageMap[d.status].count++;
      stageMap[d.status].total_value += parseFloat(d.deal_value || 0);
    }
    const stages = STATUS_ORDER
      .filter(s => stageMap[s])
      .map(s => stageMap[s]);

    const activeDeals = (deals || []).filter(d => !['lost','paid'].includes(d.status));
    const total_pipeline_value = activeDeals.reduce((sum, d) => sum + parseFloat(d.deal_value || 0), 0);
    const total_active_deals = activeDeals.length;

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const deals_this_month = (deals || []).filter(d => new Date(d.created_at) >= thisMonthStart).length;

    res.json({ stages, total_pipeline_value, total_active_deals, deals_this_month });
  } catch (error) {
    console.error('GET /api/deals/pipeline error:', error);
    res.status(500).json({ error: error.message });
  }
}
