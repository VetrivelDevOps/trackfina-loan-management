import { Request, Response } from 'express';
import * as loanService from '../services/loan.service';
import { PaymentMethod } from '../models/payment.model';

export const createLoan = async (req: Request, res: Response) => {
    try {
        const loanData = req.body;
        const newLoan = await loanService.createLoan(loanData);
        res.status(201).json(newLoan);
    } catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({ 
            message: 'Error creating loan', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getLoans = async (req: Request, res: Response) => {
    try {
        const { customerId, companyId, branchId } = req.query;
        
        let loans;
        if (customerId) {
            loans = await loanService.getLoansByCustomerId(customerId as string);
        } else {
            loans = await loanService.getAllLoans();
        }
        
        res.status(200).json(loans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ 
            message: 'Error fetching loans', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getLoanById = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const loan = await loanService.getLoanById(loanId);
        
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        
        res.status(200).json(loan);
    } catch (error) {
        console.error('Error fetching loan:', error);
        res.status(500).json({ 
            message: 'Error fetching loan', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getLoanWithEMIs = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const loanWithEmis = await loanService.getLoanWithEMIs(loanId);
        
        if (!loanWithEmis) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        
        res.status(200).json(loanWithEmis);
    } catch (error) {
        console.error('Error fetching loan with EMIs:', error);
        res.status(500).json({ 
            message: 'Error fetching loan with EMIs', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const updateLoan = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const loanData = req.body;
        const updatedLoan = await loanService.updateLoan(loanId, loanData);
        
        if (!updatedLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        
        res.status(200).json(updatedLoan);
    } catch (error) {
        console.error('Error updating loan:', error);
        res.status(500).json({ 
            message: 'Error updating loan', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const deleteLoan = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const result = await loanService.deleteLoan(loanId);
        
        if (!result) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting loan:', error);
        res.status(500).json({ 
            message: 'Error deleting loan', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getEMIsByLoanId = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const emis = await loanService.getEMIsByLoanId(loanId);
        
        res.status(200).json(emis);
    } catch (error) {
        console.error('Error fetching EMIs:', error);
        res.status(500).json({ 
            message: 'Error fetching EMIs', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const { emiId, amount, paymentMethod, transactionReference } = req.body;
        const collectedById = req.user?.id; // Assuming user info is attached to req by auth middleware
        
        if (!collectedById) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const result = await loanService.processPayment(
            emiId,
            collectedById,
            amount,
            paymentMethod as PaymentMethod,
            transactionReference
        );
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ 
            message: 'Error processing payment', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getLoanSummary = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const summary = await loanService.calculateLoanSummary(loanId);
        
        if (!summary) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error calculating loan summary:', error);
        res.status(500).json({ 
            message: 'Error calculating loan summary', 
            error: error instanceof Error ? error.message : String(error)
        });
    }
};