import { InferSelectModel } from "drizzle-orm";
import { payments } from "../db/schema";

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
  CHEQUE = 'CHEQUE',
  CARD = 'CARD',
  OTHER = 'OTHER'
}

// Infer model type from schema
export type Payment = InferSelectModel<typeof payments>;

// Export model with additional methods if needed
export const PaymentModel = {
  // Add business logic methods here
  
  // Example: Validate payment amount
  validatePaymentAmount(payment: Payment, emiAmount: number): boolean {
    return Number(payment.amount) <= emiAmount;
  },
  
  // Example: Format transaction reference
  formatTransactionReference(payment: Payment): string {
    if (!payment.transactionReference) {
      return 'N/A';
    }
    
    switch (payment.paymentMethod) {
      case PaymentMethod.CHEQUE:
        return `Cheque #${payment.transactionReference}`;
      case PaymentMethod.UPI:
        return `UPI ID: ${payment.transactionReference}`;
      case PaymentMethod.BANK_TRANSFER:
        return `Ref: ${payment.transactionReference}`;
      default:
        return payment.transactionReference;
    }
  }
};

export default Payment;