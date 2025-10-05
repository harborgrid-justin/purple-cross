import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

interface RequestMetrics {
  totalRequests: number;
  requestsByMethod: Record<string, number>;
  requestsByStatus: Record<string, number>;
  requestsByPath: Record<string, number>;
  averageResponseTime: number;
  totalResponseTime: number;
}

/**
 * In-memory metrics store
 * In production, this would be replaced with Prometheus or similar
 */
const metrics: RequestMetrics = {
  totalRequests: 0,
  requestsByMethod: {},
  requestsByStatus: {},
  requestsByPath: {},
  averageResponseTime: 0,
  totalResponseTime: 0,
};

/**
 * Middleware to collect request metrics
 * Implements basic observability following SRE best practices
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const path = req.route?.path || req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Update metrics
    metrics.totalRequests++;
    metrics.requestsByMethod[method] = (metrics.requestsByMethod[method] || 0) + 1;
    metrics.requestsByStatus[statusCode] = (metrics.requestsByStatus[statusCode] || 0) + 1;
    metrics.requestsByPath[path] = (metrics.requestsByPath[path] || 0) + 1;
    metrics.totalResponseTime += duration;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.totalRequests;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      logger.warn({
        message: 'Slow request detected',
        path,
        method,
        duration: `${duration}ms`,
        statusCode,
        correlationId: req.correlationId,
      });
    }

    // Log request details
    logger.info({
      message: 'Request completed',
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      correlationId: req.correlationId,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};

/**
 * Get current metrics
 */
export const getMetrics = (): RequestMetrics & { uptimeSeconds: number } => {
  return {
    ...metrics,
    uptimeSeconds: Math.floor(process.uptime()),
  };
};

/**
 * Reset metrics (useful for testing)
 */
export const resetMetrics = (): void => {
  metrics.totalRequests = 0;
  metrics.requestsByMethod = {};
  metrics.requestsByStatus = {};
  metrics.requestsByPath = {};
  metrics.averageResponseTime = 0;
  metrics.totalResponseTime = 0;
};
