import { getSupabase } from './_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { category, sort, search } = req.query;
      let query = supabase.from('sponsor_companies').select('*');

      if (category) query = query.eq('category', category);
      if (search) query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);

      if (sort === 'fit_score') query = query.order('fit_score', { ascending: false });
      else if (sort === 'name') query = query.order('name', { ascending: true });
      else if (sort === 'last_seen') query = query.order('last_seen_at', { ascending: false, nullsFirst: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      res.json({ companies: data });
    } catch (error) {
      console.error('GET /api/companies error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const { name, website, category, fit_score, funding_stage, has_partnership_page, notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;
      if (!name) return res.status(400).json({ error: 'Company name is required' });

      const { data, error } = await supabase
        .from('sponsor_companies')
        .insert({ name, website: website || null, category: category || null, fit_score: fit_score || 0, funding_stage: funding_stage || null, has_partnership_page: has_partnership_page || false, notes: notes || null, source: source || 'manual', channels_sponsoring: channels_sponsoring || null, sponsor_frequency: sponsor_frequency || null, first_seen_at: first_seen_at || null, last_seen_at: last_seen_at || null })
        .select().single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('POST /api/companies error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
