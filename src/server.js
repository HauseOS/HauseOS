import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, getPool } from './db/init.js';
import { initEditorialSchema } from './db/editorial-schema.js';
import { initSponsorSchema } from './db/sponsor-schema.js';
import editorialRoutes from './routes/editorial.js';
import contentPipelineRoutes from './routes/content-pipeline.js';
import sponsorRoutes from './routes/sponsors.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
let dbInitialized = false;

async function initializeApp() {
  try {
    await initDatabase();
    const pool = getPool();
    if (pool) {
      await initEditorialSchema(pool);
      await initSponsorSchema(pool);
      dbInitialized = true;
      console.log('✅ Editorial + Sponsor schema initialized');
    }
  } catch (error) {
    console.error('❌ Failed to initialize app:', error.message);
  }
}

initializeApp();

// Health check
app.get('/', (req, res) => {
  const dbConnected = getPool() ? '✅' : '❌';
  res.json({
    status: 'HauseOS running',
    version: '0.2.0',
    database: dbConnected,
    dbInitialized,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Editorial routes
app.use('/api/editorial', editorialRoutes);

// Content Pipeline routes
app.use('/api/content-pipeline', contentPipelineRoutes);

// Sponsor CRM routes (companies, contacts, deals, intelligence, outreach)
app.use('/api', sponsorRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 HauseOS server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: development`);
    console.log(`🗄️  Database: ${getPool() ? '✅ Connected' : '❌ Not configured'}`);
  });
}

// Export for Vercel serverless functions
export default app;
