import { getSupabase } from './_db.js';

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Database not available' });

  if (req.method === 'GET') {
    try {
      const { company_id } = req.query;

      let query = supabase
        .from('sponsor_contacts')
        .select('*, sponsor_companies(name)')
        .order('created_at', { ascending: false });

      if (company_id) query = query.eq('company_id', company_id);

      const { data, error } = await query;
      if (error) throw error;

      const contacts = (data || []).map(c => ({
        ...c,
        company_name: c.sponsor_companies?.name
      }));

      res.json({ contacts });
    } catch (error) {
      console.error('GET /api/contacts error:', error);
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === 'POST') {
    try {
      const { company_id, name, email, role, linkedin_url, notes } = req.body;
      if (!company_id || !name) return res.status(400).json({ error: 'Missing required fields: company_id, name' });

      const { data, error } = await supabase
        .from('sponsor_contacts')
        .insert({ company_id, name, email: email || null, role: role || null, linkedin_url: linkedin_url || null, notes: notes || null })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('POST /api/contacts error:', error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
