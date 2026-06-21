import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/AppError';

/**
 * 404 Catch-All Middleware.
 *
 * Registered AFTER all valid routes in app.ts.
 * Any request that doesn't match a real route falls through to here,
 * and we throw a NotFoundError which the errorHandler will format.
 *
 * Using `next(error)` instead of responding directly keeps the error
 * response format consistent with everything else.
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
