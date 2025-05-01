import { Router } from 'express';
import authRoutes from './auth.routes';
import loanRoutes from './loan.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);
router.use('/users', userRoutes);

export default router;