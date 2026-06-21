import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/AppError';

/**
 * validate — factory that returns a middleware for Zod schema validation.
 *
 * Usage in route files:
 *   router.post('/', validate(createUserSchema), userController.create);
 *
 * If validation passes, the parsed (and coerced) data replaces req.body
 * so controllers always receive clean, typed data.
 *
 * If validation fails, we convert Zod's flat issue list into our standard
 * { field, message } error array and throw a ValidationError.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // result.error is typed as ZodError by Zod when success === false
      const errors = result.error.errors.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      }));
      next(new ValidationError('Validation failed', errors));
      return;
    }

    // Replace req.body with the Zod-parsed/coerced object
    req.body = result.data;
    next();
  };

/**
 * validateQuery — factory that returns a middleware for Zod schema validation on req.query.
 */
export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.errors.map((issue) => ({
        field: issue.path.join('.') || 'query',
        message: issue.message,
      }));
      next(new ValidationError('Query validation failed', errors));
      return;
    }

    // Replace req.query with the Zod-parsed/coerced object
    req.query = result.data;
    next();
  };

