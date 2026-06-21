import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * setEnv — runs via jest `setupFiles`, which executes BEFORE any module is
 * imported into the test worker process.
 *
 * This guarantees that when `src/lib/prisma.ts` is first imported (and
 * PrismaClient is constructed), `DATABASE_URL` already points to the test DB,
 * not the development DB.
 *
 * We use `override: true` so this value wins even if a parent shell already
 * has DATABASE_URL exported (e.g. from a .env loaded by nodemon).
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
});
