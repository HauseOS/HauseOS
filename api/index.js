export default function handler(req, res) {
  const dbConnected = process.env.DATABASE_URL ? '✅' : '❌';
  res.status(200).json({
    status: 'HauseOS running',
    version: '0.1.0',
    database: dbConnected,
    environment: process.env.NODE_ENV || 'production'
  });
}
