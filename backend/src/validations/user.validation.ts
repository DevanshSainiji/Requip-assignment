import { z } from 'zod';

/**
 * Zod schema for creating a user.
 * Matches the Prisma schema and the business rules requested.
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  primaryMobile: z
    .string()
    .length(10, 'Primary mobile must be exactly 10 digits')
    .regex(/^\d+$/, 'Primary mobile must contain only numbers'),
  secondaryMobile: z
    .string()
    .length(10, 'Secondary mobile must be exactly 10 digits')
    .regex(/^\d+$/, 'Secondary mobile must contain only numbers')
    .optional(),
  aadhaar: z
    .string()
    .length(12, 'Aadhaar must be exactly 12 digits')
    .regex(/^\d+$/, 'Aadhaar must contain only numbers'),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format. Expected format: ABCDE1234F'),
  // z.coerce.date() attempts to parse strings like "1995-08-15" into Date objects
  dateOfBirth: z.coerce.date().max(new Date(), 'Date of birth cannot be in the future'),
  placeOfBirth: z.string().min(2, 'Place of birth must be at least 2 characters'),
  currentAddress: z.string().min(5, 'Current address is required'),
  permanentAddress: z.string().min(5, 'Permanent address is required'),
});

/**
 * Zod schema for updating a user.
 * All fields become optional because a PUT request might only update a subset of fields.
 */
export const updateUserSchema = createUserSchema.partial();

// Pagination validation
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
});
