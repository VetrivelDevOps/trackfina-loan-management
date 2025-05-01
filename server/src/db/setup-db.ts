import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Pass@2020@localhost:5432/trackfina',
  });

  const db = drizzle(pool, { schema });
  
  console.log('Setting up database schema...');
  
  try {
    // This will create tables defined in your schema
    // We'll use raw SQL to create tables
    for (const tableName in schema) {
      const table = (schema as any)[tableName];
      if (table && table.getSQL) {
        const sql = table.getSQL();
        console.log(`Creating table: ${tableName}`);
        await pool.query(sql);
      }
    }
    
    console.log('Database schema setup completed successfully');
  } catch (error) {
    console.error('Error setting up database schema:', error);
  } finally {
    await pool.end();
  }
};

setupDatabase().catch(err => {
  console.error('Database setup failed:', err);
  process.exit(1);
});