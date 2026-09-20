import { Response, NextFunction } from 'express';
import { RatingService } from '../services/rating.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class RatingController {
  static async submitRating(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const { orderId, targetUserId, stars, review } = req.body;
      const rating = await RatingService.submitRating(req.user.userId, orderId, targetUserId, stars, review);
      return sendSuccess(res, { rating }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getReputation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const reputation = await RatingService.getUserReputation(userId);
      return sendSuccess(res, { reputation });
    } catch (error) {
      next(error);
    }
  }
}
