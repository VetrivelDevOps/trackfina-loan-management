import { Request, Response } from 'express';
import { Loan } from '../models/loan.model';
import { LoanService } from '../services/loan.service';

export const createLoan = async (req: Request, res: Response) => {
    try {
        const loanData = req.body;
        const newLoan = await LoanService.createLoan(loanData);
        res.status(201).json(newLoan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating loan', error });
    }
};

export const getLoans = async (req: Request, res: Response) => {
    try {
        const loans = await LoanService.getAllLoans();
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans', error });
    }
};

export const getLoanById = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const loan = await LoanService.getLoanById(loanId);
        if (loan) {
            res.status(200).json(loan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loan', error });
    }
};

export const updateLoan = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const loanData = req.body;
        const updatedLoan = await LoanService.updateLoan(loanId, loanData);
        if (updatedLoan) {
            res.status(200).json(updatedLoan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating loan', error });
    }
};

export const deleteLoan = async (req: Request, res: Response) => {
    try {
        const loanId = req.params.id;
        const result = await LoanService.deleteLoan(loanId);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting loan', error });
    }
};