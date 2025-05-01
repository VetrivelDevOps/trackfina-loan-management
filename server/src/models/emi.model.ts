import { InferSelectModel } from "drizzle-orm";
import { emis } from "../db/schema";

// Export EMI status enum
export enum EMIStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  WAIVED = 'WAIVED'
}

// Infer model type from schema
export type EMI = InferSelectModel<typeof emis>;

// Export model with additional methods if needed
export const EMIModel = {
  // Add business logic methods here
  
  // Example: Calculate days overdue
  calculateDaysOverdue(emi: EMI): number | null {
    if (emi.status !== EMIStatus.OVERDUE) {
      return null;
    }
    
    const today = new Date();
    const dueDate = new Date(emi.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },
  
  // Example: Calculate remaining amount for partial payments
  calculateRemainingAmount(emi: EMI, paidAmount: number): number {
    return Number(emi.totalAmount) - paidAmount;
  }
};

export default EMI;