import { Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class PaymentController {
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const result = await PaymentService.createPaymentOrder(orderId);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, providerPaymentId, signature } = req.body;
      const result = await PaymentService.verifyPayment(orderId, providerPaymentId, signature);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
