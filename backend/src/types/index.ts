/**
 * Shared TypeScript types used across controllers, services, and repositories.
 *
 * Design rules:
 * - CreateUserInput / UpdateUserInput live in user.validation.ts (derived via z.infer
 *   so they're always in sync with the Zod schema — no manual duplication).
 * - UserRecord re-exports Prisma's generated User type so the rest of the codebase
 *   never imports @prisma/client directly, giving us one place to change if we
 *   ever swap ORMs.
 */

// ── Re-export Prisma's generated type ─────────────────────────────────────────
// Prisma generates this from schema.prisma; `prisma generate` keeps it up to date.
export { User as UserRecord } from '@prisma/client';

// ── Pagination ─────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Service return shapes ──────────────────────────────────────────────────────

import { User } from '@prisma/client';

/**
 * What UserService.getUsers() returns.
 * Exported so tests can type their expected values without duplication.
 */
export interface GetUsersResult {
  data: User[];
  pagination: PaginationMeta;
}

// ── API error field ────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}
