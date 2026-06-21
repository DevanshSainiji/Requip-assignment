import { Response } from 'express';
import { PaginationMeta } from '../types';

/**
 * sendSuccess — sends a consistent success envelope.
 *
 * Shape:
 * { success: true, message, data, pagination? }
 *
 * All controllers must use this instead of calling res.json() directly.
 * This guarantees every success response has the same top-level structure.
 */
export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationMeta,
): Response => {
  const body: Record<string, unknown> = { success: true, message, data };

  if (pagination) {
    body.pagination = pagination;
  }

  return res.status(statusCode).json(body);
};

/**
 * sendError — sends a consistent error envelope.
 *
 * Shape:
 * { success: false, message, errors? }
 *
 * The `errors` array is only included for validation failures (400)
 * so clients can highlight specific form fields.
 */
export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: Array<{ field: string; message: string }>,
): Response => {
  const body: Record<string, unknown> = { success: false, message };

  if (errors && errors.length > 0) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};
