import { Router } from 'express';
import { AdminRepository } from './admin.repository.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.get(
  '/admin/users',
  authenticate,
  authorize(['admin']),
  adminController.getUsers
);

router.put(
  '/admin/users/:id/role',
  authenticate,
  authorize(['admin']),
  adminController.changeUserRole
);

export default router;
