import { prisma } from '../lib/prisma';

/**
 * Global test setup — runs once per test FILE (not per test).
 *
 * `setupFilesAfterFramework` executes after the Jest test framework is
 * installed, so `beforeEach`/`afterAll` are available here.
 *
 * Strategy:
 *   - `beforeEach`: hard-delete ALL rows before every single test.
 *     This guarantees each test starts with a completely empty `users` table,
 *     so tests are fully isolated and order-independent.
 *   - `afterAll`: disconnect Prisma so Jest exits cleanly (no open handle warning).
 *
 * Note: `prisma.user.deleteMany({})` does a SQL DELETE (hard delete), not
 * a soft-delete, so it bypasses our application-level `deletedAt` logic and
 * truly empties the table.
 */

beforeEach(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});
