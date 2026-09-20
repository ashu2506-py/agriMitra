import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/analytics', authenticate, authorize(['ADMIN']), AdminController.getAnalytics);
router.get('/users', authenticate, authorize(['ADMIN']), AdminController.getUsers);

export default router;
