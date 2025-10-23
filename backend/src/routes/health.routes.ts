import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
import { checkRedisHealth } from '../config/redis';
import { cacheService } from '../services/cache.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * Basic health check - always returns 200 if server is running
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Liveness probe - indicates if the application is running
 * Used by Kubernetes to determine if the pod should be restarted
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness probe - indicates if the application is ready to serve traffic
 * Checks all critical dependencies
 */
router.get('/ready', async (req: Request, res: Response) => {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;

    // Check Redis connection
    checks.redis = await checkRedisHealth();

    const allReady = Object.values(checks).every(
      (check) => check === true || typeof check === 'string'
    );

    if (allReady) {
      res.status(200).json({
        status: 'ready',
        checks,
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        checks,
      });
    }
  } catch (error) {
    logger.error({
      message: 'Readiness check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      correlationId: req.correlationId,
    });

    res.status(503).json({
      status: 'not_ready',
      checks,
      error: 'Health check failed',
    });
  }
});

/**
 * Detailed health check with system metrics
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    node_version: process.version,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    },
    cpu: process.cpuUsage(),
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis and get cache stats
    const redisHealthy = await checkRedisHealth();
    const cacheStats = redisHealthy ? await cacheService.getStats() : null;

    res.status(200).json({
      ...health,
      database: { status: 'connected' },
      redis: {
        status: redisHealthy ? 'connected' : 'disconnected',
        stats: cacheStats,
      },
    });
  } catch (error) {
    logger.error({
      message: 'Health check error',
      error: error instanceof Error ? error.message : 'Unknown error',
      correlationId: req.correlationId,
    });

    res.status(503).json({
      ...health,
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
