import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { status, tag, priority, search, sortBy = 'date', page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let query = supabase
        .from('video_ideas')
        .select('*', { count: 'exact' });

      if (status && status !== 'All') query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);
      if (tag) query = query.contains('tags', [tag]);
      if (search) query = query.or(`title.ilike.%${search}%,angle.ilike.%${search}%,description.ilike.%${search}%`);

      if (sortBy === 'priority') {
        // High → Medium → Low
        query = query.order('priority', { ascending: true }); // alphabetical fallback
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(offset, offset + parseInt(limit) - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      res.json({ ideas: data, total: count, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
      console.error('GET /editorial/ideas error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const {
        title, angle, description, audience_hook, tags, partner_fit,
        video_angle_notes, estimated_difficulty, estimated_production_hours,
        agent_origin, submitted_by_name, priority, research_links, status
      } = req.body;

      if (!title || !angle || !audience_hook) {
        return res.status(400).json({ error: 'Missing required fields: title, angle, audience_hook' });
      }
      if (!agent_origin || !submitted_by_name) {
        return res.status(400).json({ error: 'Missing required fields: agent_origin, submitted_by_name' });
      }

      const { data: idea, error } = await supabase
        .from('video_ideas')
        .insert({
          title,
          angle,
          description: description || null,
          audience_hook,
          tags: tags || null,
          partner_fit: partner_fit || null,
          video_angle_notes: video_angle_notes || null,
          estimated_difficulty: estimated_difficulty || null,
          estimated_production_hours: estimated_production_hours || null,
          agent_origin,
          submitted_by_name,
          status: status || 'brainstorm',
          priority: priority || 'medium',
        })
        .select()
        .single();

      if (error) throw error;

      // Insert research links if provided
      if (research_links && research_links.length > 0) {
        await supabase.from('research_links').insert(
          research_links.map(link => ({
            idea_id: idea.id,
            title: link.title,
            url: link.url,
            source: link.source || null,
          }))
        );
      }

      res.status(201).json(idea);
    } catch (error) {
      console.error('POST /editorial/ideas error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
