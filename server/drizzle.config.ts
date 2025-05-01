import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

export default {
  schema: resolve('./src/db/schema.ts'),
  out: './drizzle',
  dialect: 'postgresql',
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Pass@2020@localhost:5432/trackfina',
} satisfies Config;