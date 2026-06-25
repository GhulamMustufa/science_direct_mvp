import { Router } from 'express';
import { ProfileRepository } from './profile.repository.js';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

router.get('/profile', authenticate, profileController.getProfile);
router.put('/profile', authenticate, profileController.updateProfile);

export default router;
