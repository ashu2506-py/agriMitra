import { Router } from 'express';
import { LogisticsController } from '../controllers/logistics.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.get('/shipments', authenticate, LogisticsController.getShipments);
router.patch('/shipments/:id/status', authenticate, authorize(['DRIVER', 'ADMIN']), LogisticsController.updateStatus);
router.post('/shipments/:id/location', authenticate, authorize(['DRIVER']), LogisticsController.updateLocation);
router.post('/optimize-route', authenticate, LogisticsController.optimizeRoute);

export default router;
