import { Router } from 'express';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
