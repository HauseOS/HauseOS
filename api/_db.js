import pkg from 'pg';
const { Pool } = pkg;

let pool;

export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
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
