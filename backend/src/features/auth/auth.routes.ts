import { Router } from 'express';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);

export default router;
