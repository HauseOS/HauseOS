import { getSupabase } from './_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { status, company_id } = req.query;
      let query = supabase.from('sponsor_deals').select(`
        *,
        sponsor_companies(name, category, fit_score),
        sponsor_contacts(name, email),
        video_ideas(title)
      `).order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (company_id) query = query.eq('company_id', company_id);

      const { data, error } = await query;
      if (error) throw error;

      // Flatten joined fields to match legacy shape
      const deals = (data || []).map(d => ({
        ...d,
        company_name: d.sponsor_companies?.name,
        company_category: d.sponsor_companies?.category,
        company_fit_score: d.sponsor_companies?.fit_score,
        contact_name: d.sponsor_contacts?.name,
        contact_email: d.sponsor_contacts?.email,
        idea_title: d.video_ideas?.title,
        sponsor_companies: undefined,
        sponsor_contacts: undefined,
        video_ideas: undefined,
      }));

      res.json({ deals });
    } catch (error) {
      console.error('GET /api/deals error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const { company_id, contact_id, content_idea_id, status, deal_type, deal_value, notes } = req.body;
      if (!company_id) return res.status(400).json({ error: 'company_id is required' });

      const { data, error } = await supabase
        .from('sponsor_deals')
        .insert({ company_id, contact_id: contact_id || null, content_idea_id: content_idea_id || null, status: status || 'discovered', deal_type: deal_type || null, deal_value: deal_value || null, notes: notes || null })
        .select().single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('POST /api/deals error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
