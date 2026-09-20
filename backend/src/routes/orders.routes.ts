import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, OrderController.createOrder);
router.get('/', authenticate, OrderController.getOrders);
router.get('/:id', authenticate, OrderController.getOrderById);

export default router;
