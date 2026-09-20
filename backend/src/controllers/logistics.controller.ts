import { Response, NextFunction } from 'express';
import { LogisticsService } from '../services/logistics.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class LogisticsController {
  static async getShipments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const driverId = req.user.role === 'DRIVER' ? req.user.userId : undefined;
      const shipments = await LogisticsService.getShipments(driverId);
      return sendSuccess(res, { shipments });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const { status } = req.body;
      const updated = await LogisticsService.updateShipmentStatus(req.params.id, req.user.userId, status);
      return sendSuccess(res, { shipment: updated });
    } catch (error) {
      next(error);
    }
  }

  static async updateLocation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const { latitude, longitude } = req.body;
      const updated = await LogisticsService.updateShipmentLocation(req.params.id, req.user.userId, latitude, longitude);
      return sendSuccess(res, { shipment: updated });
    } catch (error) {
      next(error);
    }
  }

  static async optimizeRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { pickups, deliveries } = req.body;
      const result = await LogisticsService.optimizeRoute(pickups || [], deliveries || []);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
