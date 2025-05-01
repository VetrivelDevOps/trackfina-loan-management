import { pgTable, uuid, varchar, timestamp, boolean, text, integer, date, decimal } from 'drizzle-orm/pg-core';

// Companies
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  contactNumber: varchar('contact_number', { length: 20 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// Branches
export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  contactNumber: varchar('contact_number', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// Groups
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  mobile: varchar('mobile', { length: 15 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// Roles
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  permissions: text('permissions').notNull(), // JSON stored as text
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User Company Roles (for multi-tenancy)
export const userCompanyRoles = pgTable('user_company_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  roleId: uuid('role_id').references(() => roles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Customers
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  groupId: uuid('group_id').references(() => groups.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  mobile: varchar('mobile', { length: 15 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  idProofType: varchar('id_proof_type', { length: 50 }),
  idProofNumber: varchar('id_proof_number', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
});

// Loans
export const loans = pgTable('loans', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  principalAmount: decimal('principal_amount', { precision: 12, scale: 2 }).notNull(),
  commissionAmount: decimal('commission_amount', { precision: 12, scale: 2 }),
  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }),
  isCommissionPercentage: boolean('is_commission_percentage').default(true).notNull(),
  disbursedAmount: decimal('disbursed_amount', { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(),
  paymentFrequency: varchar('payment_frequency', { length: 20 }).notNull(), // 'WEEKLY' or 'MONTHLY'
  tenureMonths: integer('tenure_months').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  paymentDay: integer('payment_day').notNull(), // day of week (0-6) for weekly or day of month (1-31) for monthly
  status: varchar('status', { length: 20 }).default('PENDING').notNull(), // 'PENDING', 'ACTIVE', 'CLOSED', 'DEFAULT'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// EMIs
export const emis = pgTable('emis', {
  id: uuid('id').primaryKey().defaultRandom(),
  loanId: uuid('loan_id').references(() => loans.id).notNull(),
  emiNumber: integer('emi_number').notNull(),
  dueDate: date('due_date').notNull(),
  principalAmount: decimal('principal_amount', { precision: 12, scale: 2 }).notNull(),
  interestAmount: decimal('interest_amount', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('PENDING').notNull(), // 'PENDING', 'PAID', 'PARTIAL', 'OVERDUE'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Payments
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  emiId: uuid('emi_id').references(() => emis.id).notNull(),
  collectedBy: uuid('collected_by').references(() => users.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentDate: date('payment_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'CASH', 'UPI', 'BANK_TRANSFER'
  transactionReference: varchar('transaction_reference', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});