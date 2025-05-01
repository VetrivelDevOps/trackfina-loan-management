import api from './api';

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEFAULTED = 'DEFAULTED',
  REJECTED = 'REJECTED'
}

export enum LoanType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  HOME = 'HOME',
  VEHICLE = 'VEHICLE',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER'
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  customerId: string;
  customerName?: string;
  principalAmount: number;
  interestRate: number;
  term: number; // in months
  loanType: LoanType;
  status: LoanStatus;
  startDate?: string;
  endDate?: string;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  remainingBalance?: number;
  totalInterest?: number;
  collateral?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanFormData {
  customerId: string;
  principalAmount: number;
  interestRate: number;
  term: number;
  loanType: LoanType;
  startDate?: string;
  collateral?: string;
  notes?: string;
}

export interface PaymentFormData {
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes?: string;
}

export interface PaymentHistory {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

class LoanService {
  async getLoans(filters: Record<string, any> = {}) {
    const response = await api.get('/loans', { params: filters });
    return response.data;
  }

  async getLoan(id: string) {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  }

  async createLoan(loanData: LoanFormData) {
    const response = await api.post('/loans', loanData);
    return response.data;
  }

  async updateLoan(id: string, loanData: Partial<LoanFormData>) {
    const response = await api.put(`/loans/${id}`, loanData);
    return response.data;
  }

  async deleteLoan(id: string) {
    const response = await api.delete(`/loans/${id}`);
    return response.data;
  }

  async changeLoanStatus(id: string, status: LoanStatus): Promise<Loan> {
    const response = await api.patch(`/loans/${id}/status`, { status });
    return response.data;
  }

  async getLoanPayments(loanId: string) {
    const response = await api.get(`/loans/${loanId}/payments`);
    return response.data;
  }

  async makePayment(loanId: string, paymentData: PaymentFormData) {
    const response = await api.post(`/loans/${loanId}/payments`, paymentData);
    return response.data;
  }

  async getPaymentReceipt(paymentId: string) {
    const response = await api.get(`/payments/${paymentId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async getLoanSchedule(loanId: string): Promise<any[]> {
    const response = await api.get(`/loans/${loanId}/schedule`);
    return response.data;
  }

  // For loan calculator
  calculateLoanSchedule(
    principal: number,
    interestRate: number,
    termMonths: number,
    startDate: string
  ) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyPayment =
      principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, termMonths) /
      (Math.pow(1 + monthlyInterestRate, termMonths) - 1);

    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    // Create amortization schedule
    const schedule = [];
    let remainingBalance = principal;
    let startDateObj = new Date(startDate);

    for (let i = 1; i <= termMonths; i++) {
      const interestForMonth = remainingBalance * monthlyInterestRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      remainingBalance -= principalForMonth;

      const paymentDate = new Date(startDateObj);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      schedule.push({
        paymentNumber: i,
        paymentAmount: monthlyPayment,
        principalAmount: principalForMonth,
        interestAmount: interestForMonth,
        remainingBalance: Math.max(0, remainingBalance),
        paymentDate: paymentDate.toISOString().split('T')[0]
      });
    }

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule
    };
  }
}

export default new LoanService();