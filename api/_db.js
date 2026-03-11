import { createClient } from '@supabase/supabase-js';

let client;

export function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return null;
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return client;
}

// Legacy alias — handlers that call getPool() will get null,
// triggering their "Database not available" fallback until they're migrated.
// Handlers migrated to getSupabase() won't call this.
export function getPool() {
  return null;
}

export function checkApiKey(req, res) {
  if (!process.env.HAUSECAMP_API_KEY) return true;
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    res.status(401).json({ error: 'Missing X-API-Key header' });
    return false;
  }
  if (apiKey !== process.env.HAUSECAMP_API_KEY) {
    res.status(403).json({ error: 'Invalid API key' });
    return false;
  }
  return true;
}
