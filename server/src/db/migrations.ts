import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

const runMigrations = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Pass@2020@localhost:5432/trackfina',
  });

  const db = drizzle(pool);
  
  console.log('Running migrations...');
  
  // Use the absolute path to the migrations folder
  const migrationsFolder = resolve(__dirname, '../../drizzle');
  
  await migrate(db, { migrationsFolder });
  console.log('Migrations completed successfully');
  
  await pool.end();
};

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});