import { Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from '../validators/auth.validator.js';
import { AuthService } from '../services/auth.service.js';
import { setAuthCookies, clearAuthCookies, verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = RegisterSchema.parse(req.body);
      const result = await AuthService.register(validatedInput);
      setAuthCookies(res, result.accessToken, result.refreshToken);
      return sendSuccess(res, { user: result.user }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = LoginSchema.parse(req.body);
      const result = await AuthService.login(validatedInput);
      setAuthCookies(res, result.accessToken, result.refreshToken);
      return sendSuccess(res, { user: result.user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response) {
    clearAuthCookies(res);
    return sendSuccess(res, { message: 'Successfully logged out' });
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body.refreshToken;
      if (!refreshToken) {
        return sendError(res, 'Refresh token missing', 'UNAUTHORIZED', 401);
      }

      const decoded = verifyRefreshToken(refreshToken);
      const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      setAuthCookies(res, newAccessToken, newRefreshToken);
      return sendSuccess(res, { accessToken: newAccessToken });
    } catch (error) {
      return sendError(res, 'Invalid refresh token', 'UNAUTHORIZED', 401);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      }
      const userProfile = await AuthService.getUserProfile(req.user.userId);
      return sendSuccess(res, { user: userProfile });
    } catch (error) {
      next(error);
    }
  }
}
