import { Response, NextFunction } from 'express';
import { CreateOrderSchema } from '../validators/order.validator.js';
import { OrderService } from '../services/order.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const input = CreateOrderSchema.parse(req.body);
      const order = await OrderService.createOrder(req.user.userId, input);
      return sendSuccess(res, { order }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const orders = await OrderService.getOrders(req.user.userId, req.user.role);
      return sendSuccess(res, { orders });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      return sendSuccess(res, { order });
    } catch (error) {
      next(error);
    }
  }
}
