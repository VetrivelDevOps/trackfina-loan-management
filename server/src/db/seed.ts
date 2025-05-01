import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Pass@2020@localhost:5432/trackfina',
  });

  const db = drizzle(pool, { schema });
  
  console.log('Seeding database with initial data...');
  
  try {
    // Create default roles
    const adminRole = await db.insert(schema.roles)
      .values({
        name: 'SaaS Admin',
        description: 'Super administrator with full access to all features',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'delete'],
          companies: ['create', 'read', 'update', 'delete'],
          branches: ['create', 'read', 'update', 'delete'],
          loans: ['create', 'read', 'update', 'delete'],
          customers: ['create', 'read', 'update', 'delete'],
          payments: ['create', 'read', 'update', 'delete']
        })
      })
      .returning()
      .then(res => res[0]);
    
    const companyAdminRole = await db.insert(schema.roles)
      .values({
        name: 'Company Admin',
        description: 'Company administrator with full access to company data',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update'],
          branches: ['create', 'read', 'update', 'delete'],
          loans: ['create', 'read', 'update', 'delete'],
          customers: ['create', 'read', 'update', 'delete'],
          payments: ['create', 'read', 'update', 'delete']
        })
      })
      .returning()
      .then(res => res[0]);
    
    const employeeRole = await db.insert(schema.roles)
      .values({
        name: 'Employee',
        description: 'Regular employee with standard operational access',
        permissions: JSON.stringify({
          loans: ['create', 'read', 'update'],
          customers: ['create', 'read', 'update'],
          payments: ['create', 'read']
        })
      })
      .returning()
      .then(res => res[0]);

    // Create a default admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await db.insert(schema.users)
      .values({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@trackfina.com',
        mobile: '9876543210',
        passwordHash,
        isActive: true
      })
      .returning()
      .then(res => res[0]);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase().catch(err => {
  console.error('Database seeding failed:', err);
  process.exit(1);
});