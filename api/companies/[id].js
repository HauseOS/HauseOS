import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data: company, error } = await supabase
        .from('sponsor_companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !company) return res.status(404).json({ error: 'Company not found' });

      const { data: contacts } = await supabase
        .from('sponsor_contacts')
        .select('*')
        .eq('company_id', id)
        .order('created_at', { ascending: false });

      const { data: deals } = await supabase
        .from('sponsor_deals')
        .select('*, video_ideas(title)')
        .eq('company_id', id)
        .order('created_at', { ascending: false });

      res.json({
        ...company,
        contacts: contacts || [],
        deals: (deals || []).map(d => ({ ...d, idea_title: d.video_ideas?.title }))
      });
    } catch (error) {
      console.error('GET /api/companies/[id] error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'PATCH') {
    try {
      const { name, website, category, fit_score, funding_stage, has_partnership_page,
              notes, source, channels_sponsoring, sponsor_frequency, first_seen_at, last_seen_at } = req.body;

      const updates = {};
      if (name !== undefined) updates.name = name;
      if (website !== undefined) updates.website = website;
      if (category !== undefined) updates.category = category;
      if (fit_score !== undefined) updates.fit_score = fit_score;
      if (funding_stage !== undefined) updates.funding_stage = funding_stage;
      if (has_partnership_page !== undefined) updates.has_partnership_page = has_partnership_page;
      if (notes !== undefined) updates.notes = notes;
      if (source !== undefined) updates.source = source;
      if (channels_sponsoring !== undefined) updates.channels_sponsoring = channels_sponsoring;
      if (sponsor_frequency !== undefined) updates.sponsor_frequency = sponsor_frequency;
      if (first_seen_at !== undefined) updates.first_seen_at = first_seen_at;
      if (last_seen_at !== undefined) updates.last_seen_at = last_seen_at;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('sponsor_companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Company not found' });

      res.json(data);
    } catch (error) {
      console.error('PATCH /api/companies/[id] error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
