import { Loan } from '../models/loan.model';
import { EMI, EMIStatus } from '../models/emi.model';
import { Payment, PaymentMethod } from '../models/payment.model';
import { User } from '../models/user.model';
import { sequelize } from '../config/database';
import { LoanData, LoanUpdateData } from '../types/loan.types';

export const createLoan = async (loanData: LoanData): Promise<Loan> => {
    // Use transaction to ensure both loan and EMIs are created successfully
    const t = await sequelize.transaction();
    
    try {
        // Create the loan
        const loan = await Loan.create(loanData, { transaction: t });
        
        // Generate EMI schedule
        const emis = generateEMISchedule(loan);
        
        // Create all EMIs in the database
        await EMI.bulkCreate(emis, { transaction: t });
        
        await t.commit();
        return loan;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// Helper function to generate EMI schedule
const generateEMISchedule = (loan: Loan): Partial<EMI>[] => {
    const { principalAmount, interestRate, tenureMonths, startDate, paymentFrequency, paymentDay } = loan;
    
    // Calculate monthly interest rate (annual rate / 12)
    const monthlyInterestRate = (interestRate / 100) / 12;
    
    // Calculate EMI amount using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiAmount = principalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths) 
                    / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    
    const emis = [];
    let remainingPrincipal = principalAmount;
    let startDateObj = new Date(startDate);
    
    for (let i = 1; i <= tenureMonths; i++) {
        const dueDate = getNextPaymentDate(startDateObj, i, paymentFrequency, paymentDay);
        
        // Calculate interest for this period
        const interestForPeriod = remainingPrincipal * monthlyInterestRate;
        
        // Calculate principal for this period
        const principalForPeriod = emiAmount - interestForPeriod;
        
        // Update remaining principal
        remainingPrincipal -= principalForPeriod;
        
        emis.push({
            loanId: loan.id,
            emiNumber: i,
            dueDate,
            principalAmount: principalForPeriod,
            interestAmount: interestForPeriod,
            totalAmount: emiAmount,
            status: EMIStatus.PENDING
        });
    }
    
    return emis;
};

// Helper function to get the next payment date based on frequency and day
const getNextPaymentDate = (
    startDate: Date, 
    periodNumber: number, 
    frequency: string,
    paymentDay: number
): Date => {
    const date = new Date(startDate);
    
    if (frequency === 'WEEKLY') {
        // Add weeks
        date.setDate(date.getDate() + (periodNumber * 7));
        
        // Adjust to correct day of week (paymentDay is 0-6, where 0 is Sunday)
        const currentDay = date.getDay();
        const daysToAdd = (paymentDay - currentDay + 7) % 7;
        date.setDate(date.getDate() + daysToAdd);
    } else {
        // Monthly
        date.setMonth(date.getMonth() + periodNumber);
        
        // Set to specific day of month
        // Handle months with fewer days than the payment day
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        date.setDate(Math.min(paymentDay, lastDayOfMonth));
    }
    
    return date;
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
    const loan = await Loan.findByPk(loanId);
    return loan;
};

export const getLoanWithEMIs = async (loanId: string) => {
    const loan = await Loan.findByPk(loanId);
    if (!loan) return null;
    
    const emis = await EMI.findAll({ 
        where: { loanId },
        order: [['emiNumber', 'ASC']]
    });
    
    return { loan, emis };
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
    // This will cascade delete all associated EMIs due to foreign key constraints
    const loan = await Loan.findByPk(loanId);
    if (loan) {
        await loan.destroy();
        return true;
    }
    return false;
};

export const getAllLoans = async (): Promise<Loan[]> => {
    const loans = await Loan.findAll({
        order: [['createdAt', 'DESC']]
    });
    return loans;
};

export const getLoansByCustomerId = async (customerId: string): Promise<Loan[]> => {
    const loans = await Loan.findAll({ 
        where: { customerId },
        order: [['createdAt', 'DESC']]
    });
    return loans;
};

export const getEMIsByLoanId = async (loanId: string) => {
    const emis = await EMI.findAll({ 
        where: { loanId },
        order: [['emiNumber', 'ASC']]
    });
    
    return emis;
};

export const processPayment = async (
    emiId: string,
    collectedById: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionReference?: string
) => {
    const t = await sequelize.transaction();
    
    try {
        // Find the EMI
        const emi = await EMI.findByPk(emiId, { transaction: t });
        
        if (!emi) {
            throw new Error('EMI not found');
        }
        
        // Create payment record
        const payment = await Payment.create({
            emiId,
            collectedBy: collectedById,
            amount,
            paymentDate: new Date(),
            paymentMethod,
            transactionReference
        }, { transaction: t });
        
        // Update EMI status based on payment amount
        if (amount >= emi.totalAmount) {
            await emi.update({ status: EMIStatus.PAID }, { transaction: t });
        } else {
            await emi.update({ status: EMIStatus.PARTIAL }, { transaction: t });
        }
        
        // Check if all EMIs for this loan are paid
        const loan = await Loan.findByPk(emi.loanId, { transaction: t });
        if (loan) {
            const allEmis = await EMI.findAll({
                where: { loanId: loan.id },
                transaction: t
            });
            
            const allPaid = allEmis.every(emi => emi.status === EMIStatus.PAID);
            
            // If all EMIs are paid, mark loan as closed
            if (allPaid) {
                await loan.update({ status: 'CLOSED' }, { transaction: t });
            }
        }
        
        await t.commit();
        return { payment, emi };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const calculateLoanSummary = async (loanId: string) => {
    const loan = await Loan.findByPk(loanId);
    if (!loan) return null;
    
    const emis = await EMI.findAll({ 
        where: { loanId },
        order: [['emiNumber', 'ASC']] 
    });
    
    let totalPaid = 0;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let remainingPrincipal = loan.principalAmount;
    
    const paidEmis = emis.filter(emi => emi.status === EMIStatus.PAID);
    const partialEmis = emis.filter(emi => emi.status === EMIStatus.PARTIAL);
    
    for (const emi of paidEmis) {
        totalPaid += Number(emi.totalAmount);
        totalPrincipalPaid += Number(emi.principalAmount);
        totalInterestPaid += Number(emi.interestAmount);
        remainingPrincipal -= Number(emi.principalAmount);
    }
    
    // Handle partial payments
    for (const emi of partialEmis) {
        const payments = await Payment.findAll({
            where: { emiId: emi.id }
        });
        
        const totalPaidForEmi = payments.reduce(
            (sum, payment) => sum + Number(payment.amount), 0
        );
        
        totalPaid += totalPaidForEmi;
        
        // Estimate principal and interest paid based on proportion
        const proportionPaid = totalPaidForEmi / Number(emi.totalAmount);
        const estimatedPrincipalPaid = Number(emi.principalAmount) * proportionPaid;
        const estimatedInterestPaid = Number(emi.interestAmount) * proportionPaid;
        
        totalPrincipalPaid += estimatedPrincipalPaid;
        totalInterestPaid += estimatedInterestPaid;
        remainingPrincipal -= estimatedPrincipalPaid;
    }
    
    // Find the next unpaid EMI
    const nextEmi = emis.find(emi => 
        emi.status === EMIStatus.PENDING || emi.status === EMIStatus.PARTIAL
    );
    
    return {
        loanId,
        totalLoanAmount: loan.principalAmount,
        totalPayable: emis.reduce((sum, emi) => sum + Number(emi.totalAmount), 0),
        totalPaid,
        totalPrincipalPaid,
        totalInterestPaid,
        remainingPrincipal,
        nextEmiDueDate: nextEmi?.dueDate,
        nextEmiAmount: nextEmi?.totalAmount,
        totalEmis: emis.length,
        paidEmis: paidEmis.length,
        partialEmis: partialEmis.length,
        pendingEmis: emis.filter(emi => emi.status === EMIStatus.PENDING).length,
        overdueEmis: emis.filter(emi => emi.status === EMIStatus.OVERDUE).length
    };
};