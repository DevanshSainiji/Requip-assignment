/**
 * Test data helpers.
 *
 * `nextUser()` generates a unique, valid user payload on every call using a
 * module-level counter. Because `beforeEach` in setup.ts wipes the DB before
 * each test, uniqueness within the DB is always guaranteed. The counter just
 * needs to give distinct values so two calls inside the same test don't clash.
 */

export const API_BASE = '/api/v1';

let _seq = 0;

/**
 * Generates a valid user payload with a unique email, Aadhaar, and PAN.
 * Optional `overrides` merge on top so individual tests can inject bad data.
 *
 * PAN format:  TESTA0001F  (5 uppercase letters + 4 digits + 1 uppercase letter)
 * Aadhaar:     000000000001 (12 digits, zero-padded)
 */
export const nextUser = (overrides: Record<string, unknown> = {}) => {
  const n = ++_seq;
  return {
    name: `Test User ${n}`,
    email: `user${n}@example.com`,
    primaryMobile: '9876543210',
    aadhaar: String(n).padStart(12, '0'),
    pan: `TESTA${String(n).padStart(4, '0')}F`,
    dateOfBirth: '1990-01-15',
    placeOfBirth: 'Delhi',
    currentAddress: '123 Integration Test Road, Bangalore',
    permanentAddress: '456 Home Lane, Mumbai',
    ...overrides,
  };
};
