import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import { validateUser } from '../middleware/validation.middleware';

const router = Router();

router.post('/', validateUser, createUser);
router.get('/:id', getUser);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', deleteUser);

export default router;