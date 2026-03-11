// API Key middleware for agent endpoints
// Checks X-API-Key header against HAUSECAMP_API_KEY env var

export function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!process.env.HAUSECAMP_API_KEY) {
    console.warn('HAUSECAMP_API_KEY not set — API key auth disabled');
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing X-API-Key header' });
  }

  if (apiKey !== process.env.HAUSECAMP_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}
