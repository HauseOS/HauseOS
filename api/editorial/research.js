import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { urgency, tag, agent, search, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let query = supabase
        .from('research_drops')
        .select('*', { count: 'exact' });

      if (urgency) query = query.eq('urgency', urgency);
      if (agent) query = query.eq('agent_origin', agent);
      if (tag) query = query.contains('key_findings', [tag]);
      if (search) query = query.or(`topic.ilike.%${search}%,summary.ilike.%${search}%`);

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      res.json({ research: data, total: count, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
      console.error('GET /editorial/research error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const {
        topic, summary, key_findings, supporting_data, audience_data,
        partner_fit, urgency, suggested_angles, agent_origin
      } = req.body;

      if (!topic || !summary || !agent_origin) {
        return res.status(400).json({ error: 'Missing required fields: topic, summary, agent_origin' });
      }

      const { data: drop, error } = await supabase
        .from('research_drops')
        .insert({
          topic,
          summary,
          key_findings: key_findings || null,
          supporting_data: supporting_data || null,
          audience_data: audience_data || null,
          partner_fit: partner_fit || null,
          urgency: urgency || 'low',
          suggested_angles: suggested_angles || null,
          agent_origin,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(drop);
    } catch (error) {
      console.error('POST /editorial/research error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
