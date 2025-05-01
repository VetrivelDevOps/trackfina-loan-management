import { Router } from 'express';
import { 
    createLoan, 
    getLoans, 
    getLoanById, 
    updateLoan, 
    deleteLoan,
    getLoanWithEMIs,
    getEMIsByLoanId,
    processPayment,
    getLoanSummary
} from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Loan routes
router.post('/', authMiddleware, createLoan);
router.get('/', authMiddleware, getLoans);
router.get('/:id', authMiddleware, getLoanById);
router.put('/:id', authMiddleware, updateLoan);
router.delete('/:id', authMiddleware, deleteLoan);

// EMI routes
router.get('/:id/emis', authMiddleware, getEMIsByLoanId);
router.get('/:id/with-emis', authMiddleware, getLoanWithEMIs);

// Payment routes
router.post('/payments', authMiddleware, processPayment);

// Summary route
router.get('/:id/summary', authMiddleware, getLoanSummary);

export default router;