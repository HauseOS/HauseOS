import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { status, sponsor, agent } = req.query;
      let query = supabase.from('content_pipeline').select('*');
      if (status) query = query.eq('status', status);
      if (sponsor) query = query.eq('sponsor', sponsor);
      if (agent) query = query.eq('agent', agent);
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      res.json({ items: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const { title, status, sponsor, difficulty, agent, submitted_date, production_start_date, publish_date, views, watch_hours, revenue, idea_id } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const { data, error } = await supabase
        .from('content_pipeline')
        .insert({ title, status: status || 'brainstorm', sponsor: sponsor || null, difficulty: difficulty || 'moderate', agent: agent || null, submitted_date: submitted_date || new Date().toISOString(), production_start_date: production_start_date || null, publish_date: publish_date || null, views: views || 0, watch_hours: watch_hours || 0, revenue: revenue || 0, idea_id: idea_id || null })
        .select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
