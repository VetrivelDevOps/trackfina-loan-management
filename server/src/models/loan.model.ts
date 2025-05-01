import { InferSelectModel } from "drizzle-orm";
import { loans, emis, payments } from "../db/schema";

// Export loan status enum
export enum LoanStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE', 
  CLOSED = 'CLOSED',
  DEFAULT = 'DEFAULT'
}

// Export payment frequency enum
export enum PaymentFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

// Infer model types from schema
export type Loan = InferSelectModel<typeof loans>;

// Export model with additional methods if needed
export const LoanModel = {
  // Add any loan-related business logic methods here
  
  // Example: Calculate total interest for a loan
  calculateTotalInterest(loan: Loan): number {
    const monthlyInterestRate = Number(loan.interestRate) / 100 / 12;
    const totalInterest = Number(loan.principalAmount) * monthlyInterestRate * loan.tenureMonths;
    return Number(totalInterest.toFixed(2));
  },
  
  // Example: Calculate EMI amount
  calculateEMIAmount(loan: Loan): number {
    const P = Number(loan.principalAmount);
    const r = Number(loan.interestRate) / 100 / 12;
    const n = loan.tenureMonths;
    
    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Number(emi.toFixed(2));
  },
  
  // Example: Calculate loan end date
  calculateEndDate(startDate: Date, tenureMonths: number): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + tenureMonths);
    return endDate;
  }
};