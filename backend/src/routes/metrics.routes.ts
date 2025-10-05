import { Router, Request, Response } from 'express';
import { getMetrics } from '../middleware/metrics';

const router = Router();

/**
 * Metrics endpoint for monitoring and observability
 * Returns application metrics in JSON format
 * In production, consider using Prometheus format
 */
router.get('/', (_req: Request, res: Response) => {
  const metrics = getMetrics();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    timestamp: new Date().toISOString(),
    metrics: {
      requests: metrics,
      system: {
        uptime: metrics.uptimeSeconds,
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
          heapUsedPercentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        },
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    },
  });
});

export default router;
