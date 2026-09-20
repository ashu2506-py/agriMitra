import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AdminController {
  static async getAnalytics(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await AdminService.getPlatformAnalytics();
      return sendSuccess(res, { analytics });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getUsers();
      return sendSuccess(res, { users });
    } catch (error) {
      next(error);
    }
  }
}
