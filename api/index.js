import { getSupabase } from './_db.js';

export default async function handler(req, res) {
  try {
    const supabase = getSupabase();
    let dbStatus = '❌';
    if (supabase) {
      const { error } = await supabase.from('video_ideas').select('id').limit(1);
      dbStatus = error ? `⚠️ ${error.message}` : '✅';
    }
    res.status(200).json({
      status: 'HauseOS running',
      version: '0.2.0',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
}
