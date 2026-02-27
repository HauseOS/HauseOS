import express from 'express';
import cors from 'cors';

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
    environment: process.env.NODE_ENV || 'production'
  });
});

export default app;
