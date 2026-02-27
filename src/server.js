import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  const dbConnected = process.env.DATABASE_URL ? '✅' : '❌';
  res.json({ 
    status: 'HauseOS running', 
    version: '0.1.0',
    database: dbConnected,
    environment: process.env.NODE_ENV || 'development'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 HauseOS server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: development`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  });
}

// Export for Vercel serverless functions
export default app;
