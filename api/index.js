export default function handler(req, res) {
  try {
    const dbConnected = process.env.DATABASE_URL ? '✅' : '❌';
    res.status(200).json({
      status: 'HauseOS running',
      version: '0.1.0',
      database: dbConnected,
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
