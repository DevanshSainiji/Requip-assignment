import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton.
 *
 * WHY: PrismaClient opens a connection pool to MySQL. Instantiating it
 * multiple times in the same process wastes connections. We keep one
 * instance on `globalThis` so it survives hot-reloads in dev mode (nodemon
 * re-runs the module but doesn't restart the Node process itself).
 *
 * In production, a new instance is created once on start-up and reused.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    // In development: log every SQL query + warnings + errors.
    // In production: log errors only — keeps logs clean.
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
