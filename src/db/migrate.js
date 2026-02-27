import dotenv from 'dotenv';
import { initDatabase } from './init.js';
import { seedDatabase } from './seed.js';

dotenv.config();

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');
    await initDatabase();
    console.log('✅ Migrations complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
