import 'dotenv/config'; // Must be first — loads .env before anything else
import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

/**
 * Server Bootstrap.
 *
 * Responsibilities:
 * 1. Start the HTTP server on the configured port
 * 2. Handle OS signals for graceful shutdown
 * 3. Handle unhandled Promise rejections (catch programming errors)
 *
 * Graceful shutdown is important:
 * - SIGTERM is sent by process managers (PM2, Docker, Kubernetes) before kill
 * - We stop accepting new requests, let in-flight requests finish,
 *   then disconnect Prisma cleanly so no DB queries are left hanging
 */
const server = app.listen(PORT, () => {
  console.info(`🚀 Server running at http://localhost:${PORT}`);
  console.info(`📚 API Docs:      http://localhost:${PORT}/api-docs`);
  console.info(`🌍 Environment:   ${process.env.NODE_ENV || 'development'}`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────

const shutdown = async (signal: string) => {
  console.warn(`\n${signal} received — shutting down gracefully`);

  server.close(async () => {
    console.warn('HTTP server closed');
    await prisma.$disconnect();
    console.warn('Database connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C in terminal

// ── Unhandled rejections ──────────────────────────────────────────────────────

// If a Promise rejects without a .catch(), log it and exit.
// Exiting is intentional — a partially broken state is worse than a restart.
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Promise Rejection:', reason?.message ?? reason);
  server.close(() => process.exit(1));
});
