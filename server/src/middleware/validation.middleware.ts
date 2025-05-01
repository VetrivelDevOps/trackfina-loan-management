import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const validateLoanApplication = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('term').isNumeric().withMessage('Term must be a number'),
    body('interestRate').isNumeric().withMessage('Interest rate must be a number'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserRegistration = [
    body('username').isString().withMessage('Username must be a string'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { validateLoanApplication, validateUserRegistration };