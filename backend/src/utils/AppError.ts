/**
 * AppError — base class for all known operational errors.
 *
 * "Operational" means we threw this intentionally (e.g. "user not found").
 * It is distinct from programming bugs (e.g. a TypeError from a typo).
 *
 * The errorHandler middleware checks `isOperational` to decide whether
 * to expose the message to the client or hide it behind a generic 500.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Required when extending built-in classes in TypeScript.
    // Without this, `instanceof` checks can fail after transpilation
    // because TypeScript's class extension of Error doesn't set the prototype chain correctly.
    Object.setPrototypeOf(this, new.target.prototype);

    // Set name to the subclass name so logs show 'NotFoundError' not 'Error'
    this.name = this.constructor.name;

    // Keeps the stack trace clean — points to the throw site, not this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Concrete error subclasses ────────────────────────────────────────────────

/**
 * 404 — Resource not found.
 * Thrown when a DB query returns null for a requested ID.
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 400 — Input validation failure.
 * Carries a structured `errors` array so the client knows which fields failed.
 */
export class ValidationError extends AppError {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(
    message = 'Validation failed',
    errors: Array<{ field: string; message: string }> = [],
  ) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * 409 — Unique constraint conflict.
 * Thrown when a duplicate email, PAN, or Aadhaar is detected.
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}
