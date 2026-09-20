import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(
    { err, path: req.path, method: req.method },
    'Unhandled request error'
  );

  if (err instanceof ZodError) {
    return sendError(
      res,
      'Input validation failed',
      'VALIDATION_ERROR',
      400,
      err.errors
    );
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return sendError(res, message, code, statusCode);
};
