export interface Loan {
    id: string;
    userId: string;
    amount: number;
    interestRate: number;
    term: number; // in months
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface LoanApplication {
    userId: string;
    amount: number;
    interestRate: number;
    term: number; // in months
}

export interface LoanDetail {
    loan: Loan;
    payments: Payment[];
}

export interface Payment {
    id: string;
    loanId: string;
    amount: number;
    paymentDate: Date;
    status: 'pending' | 'completed' | 'failed';
}