import { z } from 'zod';

/**
 * Zod schema for creating a user.
 *
 * Design decisions:
 * - .trim() on strings: strips accidental leading/trailing whitespace before validation.
 * - PAN: case-insensitive regex + .toUpperCase() so "abcde1234f" is accepted and stored as "ABCDE1234F".
 * - email .toLowerCase(): normalises "User@Gmail.COM" → "user@gmail.com" before storage.
 * - Mobile/Aadhaar: regex already anchors both start/end AND digit-only, so a
 *   separate .length() call is redundant — the regex `\d{10}` asserts exactly 10 digits.
 * - dateOfBirth .max(new Date()): rejects future dates at schema level.
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string()
    .trim()
    .toLowerCase()                           // normalise before email format check
    .email('Invalid email format'),

  primaryMobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Primary mobile must be exactly 10 digits'),

  secondaryMobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Secondary mobile must be exactly 10 digits')
    .optional(),

  aadhaar: z
    .string()
    .trim()
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),

  pan: z
    .string()
    .trim()
    .toUpperCase()                           // BUG FIX: accept lowercase/mixed-case PAN input
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,           // note: removed redundant {1} — same semantics
      'Invalid PAN format. Expected format: ABCDE1234F',
    ),

  // z.coerce.date() parses ISO strings like "1995-08-15" into Date objects
  dateOfBirth: z.coerce
    .date()
    .max(new Date(), 'Date of birth cannot be in the future'),

  placeOfBirth: z
    .string()
    .trim()
    .min(2, 'Place of birth must be at least 2 characters'),

  currentAddress: z
    .string()
    .trim()
    .min(5, 'Current address must be at least 5 characters'),

  permanentAddress: z
    .string()
    .trim()
    .min(5, 'Permanent address must be at least 5 characters'),
});

/**
 * Update schema — all fields optional, but at least ONE must be supplied.
 *
 * BUG FIX: Without the .refine(), an empty body {} passes validation and
 * triggers a no-op DB update, wasting a round-trip and confusing the caller.
 */
export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),    // trim search to avoid " john " ≠ "john"
});

// ── Inferred TypeScript types — derived from schemas, always in sync ───────────
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Note: z.infer on a .partial().refine() gives Partial<...> which is correct
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
