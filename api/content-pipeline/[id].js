import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('content_pipeline')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'PATCH') {
    try {
      const { title, status, sponsor, difficulty, agent,
              production_start_date, publish_date, views, watch_hours, revenue } = req.body;

      const updates = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title;
      if (status !== undefined) updates.status = status;
      if (sponsor !== undefined) updates.sponsor = sponsor;
      if (difficulty !== undefined) updates.difficulty = difficulty;
      if (agent !== undefined) updates.agent = agent;
      if (production_start_date !== undefined) updates.production_start_date = production_start_date;
      if (publish_date !== undefined) updates.publish_date = publish_date;
      if (views !== undefined) updates.views = views;
      if (watch_hours !== undefined) updates.watch_hours = watch_hours;
      if (revenue !== undefined) updates.revenue = revenue;

      const { data, error } = await supabase
        .from('content_pipeline')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('content_pipeline')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
