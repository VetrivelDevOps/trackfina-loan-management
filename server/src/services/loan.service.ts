import { Loan } from '../models/loan.model';
import { User } from '../models/user.model';
import { Payment } from '../models/payment.model';
import { LoanData, LoanUpdateData } from '../types/loan.types';

export const createLoan = async (loanData: LoanData): Promise<Loan> => {
    const loan = await Loan.create(loanData);
    return loan;
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
    const loan = await Loan.findByPk(loanId);
    return loan;
};

export const updateLoan = async (loanId: string, updateData: LoanUpdateData): Promise<Loan | null> => {
    const loan = await Loan.findByPk(loanId);
    if (loan) {
        await loan.update(updateData);
        return loan;
    }
    return null;
};

export const deleteLoan = async (loanId: string): Promise<boolean> => {
    const loan = await Loan.findByPk(loanId);
    if (loan) {
        await loan.destroy();
        return true;
    }
    return false;
};

export const getAllLoans = async (): Promise<Loan[]> => {
    const loans = await Loan.findAll();
    return loans;
};

export const getLoansByUserId = async (userId: string): Promise<Loan[]> => {
    const loans = await Loan.findAll({ where: { userId } });
    return loans;
};