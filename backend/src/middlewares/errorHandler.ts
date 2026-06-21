import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';

/**
 * Subset of Prisma's error shape that we inspect in the error handler.
 * We only type what we actually USE, keeping this simple.
 */
interface PrismaError extends Error {
  code: string;
  meta?: { target?: string[]; cause?: string };
}

const isPrismaError = (err: Error): err is PrismaError =>
  typeof (err as PrismaError).code === 'string' && err.constructor.name.startsWith('PrismaClient');

/**
 * Global Error Handler Middleware.
 *
 * Must be registered LAST in app.ts (after all routes).
 * Express identifies it as an error handler because it has 4 parameters.
 *
 * Handles four categories of errors:
 *
 * 1. ValidationError  — our own 400, includes field-level `errors` array
 * 2. AppError         — our own operational errors (404, 409, etc.)
 * 3. Prisma P2002     — unique constraint violation → 409
 * 4. Prisma P2025     — record not found (update/delete) → 404
 * 5. Unknown          — unexpected programming errors; never expose details
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  // ── 1. Validation errors (400) ──────────────────────────────────────────────
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // ── 2. Known operational errors (404, 409, etc.) ────────────────────────────
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // ── 3 & 4. Prisma known errors ───────────────────────────────────────────────
  if (isPrismaError(err)) {
    // P2002: unique constraint violation (duplicate email, PAN, Aadhaar)
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] ?? 'field';
      const readableField = field.charAt(0).toUpperCase() + field.slice(1);
      sendError(res, `${readableField} already exists`, 409);
      return;
    }

    // P2025: record to update/delete was not found in the database
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // ── 5. Unknown errors — never expose stack traces to clients ─────────────────
  console.error('[Unhandled Error]', err.message, err.stack);
  sendError(res, 'Internal server error', 500);
};
