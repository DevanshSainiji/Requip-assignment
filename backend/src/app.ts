import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import v1Router from './routes/index';
import swaggerSpec from './utils/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

/**
 * Express Application Factory.
 *
 * Kept separate from server.ts so the app can be imported in tests
 * without starting an HTTP listener. This is the standard pattern
 * for testing Express apps with Supertest.
 *
 * Middleware registration order matters:
 *   1. Security (helmet, cors)
 *   2. Logging (morgan)
 *   3. Body parsing
 *   4. Documentation
 *   5. Routes
 *   6. 404 handler   ← must be after routes
 *   7. Error handler ← must be last (4 args signals it to Express)
 */
const app = express();

// ── 1. Security ───────────────────────────────────────────────────────────────

// Trust the first proxy (nginx, AWS ALB, etc.) so req.ip is the real client IP.
// Safe to set in dev; does nothing without an actual proxy in front.
app.set('trust proxy', 1);

// helmet sets sensible HTTP security headers.
// We disable contentSecurityPolicy here because Swagger UI loads inline scripts
// that helmet's strict default CSP would block.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — only the Vite dev server origin is allowed during development.
// In production, replace CLIENT_URL with your deployed frontend domain.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

// ── 2. Logging ────────────────────────────────────────────────────────────────

// 'dev' format: METHOD /path STATUS ms  (colorized in terminal)
// 'combined' format: Apache-style, better for log aggregation in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── 3. Body parsing ───────────────────────────────────────────────────────────

// 10kb limit prevents trivial DoS attacks via oversized JSON payloads.
// A user object is never close to this size — 10kb is generous.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── 4. Documentation ─────────────────────────────────────────────────────────

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── 5. Routes ─────────────────────────────────────────────────────────────────

// All API routes are versioned under /api/v1
// This allows us to ship /api/v2 in the future without breaking existing clients
app.use('/api/v1', v1Router);

// ── 6. 404 handler ────────────────────────────────────────────────────────────

app.use(notFound);

// ── 7. Global error handler ───────────────────────────────────────────────────

app.use(errorHandler);

export default app;
