import { Router } from 'express';
import { OjsClient } from './ojs.client.js';
import { SyncRepository } from './sync.repository.js';
import { SyncService } from './sync.service.js';
import { SyncController } from './sync.controller.js';
import { AuthRepository } from '../auth/auth.repository.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

const ojsClient = new OjsClient();
const syncRepository = new SyncRepository();
const authRepository = new AuthRepository();
export const syncService = new SyncService(ojsClient, syncRepository, authRepository);
const syncController = new SyncController(syncService);

router.post(
  '/admin/sync/trigger',
  authenticate,
  authorize(['admin']),
  syncController.triggerSync
);

router.get(
  '/admin/sync/status/:jobId',
  authenticate,
  authorize(['admin']),
  syncController.getJobStatus
);

export default router;
