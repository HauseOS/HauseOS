import { getPool } from './init.js';

export async function seedDatabase() {
  const pool = getPool();

  const users = [
    { name: 'Yeeling', email: 'yeeling@hause.co', role: 'admin' },
    { name: 'Anders', email: 'anders@hause.co', role: 'approver' },
    { name: 'Aurelius', email: 'aurelius@hause.co', role: 'agent' },
  ];

  for (const user of users) {
    try {
      await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
        [user.name, user.email, user.role]
      );
      console.log(`✓ User created: ${user.name}`);
    } catch (error) {
      console.error(`Error creating user ${user.name}:`, error.message);
    }
  }
}
