import { body, validationResult } from 'express-validator';

export const loanValidationRules = () => {
    return [
        body('amount').isNumeric().withMessage('Amount must be a number'),
        body('term').isInt({ min: 1 }).withMessage('Term must be at least 1 month'),
        body('interestRate').isNumeric().withMessage('Interest rate must be a number'),
        body('userId').isUUID().withMessage('User ID must be a valid UUID'),
    ];
};

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};