import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import { sendSuccess } from '../utils/apiResponse';

/**
 * v1 Router — root of the /api/v1 namespace.
 *
 * The health check endpoint is intentionally simple — it lets load balancers,
 * Docker health checks, and developers confirm the server is up without
 * touching the database.
 */
const router = Router();

// Mount user routes
router.use('/users', userRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns 200 if the API server is running.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, { timestamp: new Date().toISOString() }, 'API is healthy');
});

export default router;
