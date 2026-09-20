import { Response, NextFunction } from 'express';
import { MatchingService } from '../services/matching.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class MatchingController {
  static async getMatches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { requirementId } = req.params;
      const result = await MatchingService.matchBuyerRequirements(requirementId);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async createRequirement(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const requirement = await MatchingService.createBuyerRequirement(req.user.userId, req.body);
      return sendSuccess(res, { requirement }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getRequirements(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
      const requirements = await MatchingService.getBuyerRequirements(req.user.userId);
      return sendSuccess(res, { requirements });
    } catch (error) {
      next(error);
    }
  }
}
