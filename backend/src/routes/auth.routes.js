import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', isAuthenticated, getMe);

export default router;
