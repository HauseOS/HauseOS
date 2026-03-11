import { getSupabase } from '../_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const supabase = getSupabase();
    if (!supabase) return res.status(500).json({ ok: false, error: 'Database not configured' });
    const { error } = await supabase.from('video_ideas').select('id').limit(1);
    if (error) throw error;
    res.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message, timestamp: new Date().toISOString() });
  }
}
