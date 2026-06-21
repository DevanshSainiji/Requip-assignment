/**
 * Shared TypeScript types used across controllers, services, and repositories.
 *
 * Keeping types in one place avoids circular imports and gives
 * a single source of truth for any interviewer reading the code.
 */

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── API response envelopes ───────────────────────────────────────────────────

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

/**
 * The shape of a User as returned from the database (Prisma includes all fields).
 * We use Prisma's generated type in most places, but this is useful for
 * defining function signatures without importing from @prisma/client everywhere.
 */
export interface UserRecord {
  id: number;
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile: string | null;
  aadhaar: string;
  pan: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Input type for creating a user — all required fields.
 * Mirrors the Zod schema output for createUserSchema.
 */
export interface CreateUserInput {
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile?: string;
  aadhaar: string;
  pan: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
}

/**
 * Input type for updating a user — all fields optional.
 * Mirrors the Zod schema output for updateUserSchema.
 */
export type UpdateUserInput = Partial<CreateUserInput>;
