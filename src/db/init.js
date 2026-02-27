import pkg from 'pg';
const { Pool } = pkg;

let pool;

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set. Skipping database initialization.');
    return;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // Test connection
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', res.rows[0]);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Don't throw - allow server to start anyway
  }

  // Create tables if they don't exist
  await createTables();
}

async function createTables() {
  if (!pool) return;

  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'approver', 'agent')),
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Work submissions
    `CREATE TABLE IF NOT EXISTS work_submissions (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL CHECK (type IN ('content', 'research', 'outreach', 'strategy', 'other')),
      author_id INTEGER REFERENCES users(id),
      content TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'shipped')),
      priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      approved_by INTEGER REFERENCES users(id),
      approved_at TIMESTAMP
    )`,

    // Approval workflow
    `CREATE TABLE IF NOT EXISTS approvals (
      id SERIAL PRIMARY KEY,
      work_id INTEGER REFERENCES work_submissions(id),
      approver_id INTEGER REFERENCES users(id),
      decision VARCHAR(20) NOT NULL CHECK (decision IN ('approved', 'rejected', 'pending')),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Agent logs
    `CREATE TABLE IF NOT EXISTS agent_logs (
      id SERIAL PRIMARY KEY,
      agent_name VARCHAR(255) NOT NULL,
      action VARCHAR(255) NOT NULL,
      work_id INTEGER REFERENCES work_submissions(id),
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
      console.log('✓ Table created/verified');
    } catch (error) {
      console.error('Table creation error:', error.message);
    }
  }
}

export function getPool() {
  return pool;
}
