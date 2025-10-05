import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Middleware to handle request timeouts
 * Prevents hung requests from consuming resources
 */
export const timeoutMiddleware = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set timeout for the request
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.error({
          message: 'Request timeout',
          path: req.path,
          method: req.method,
          correlationId: req.correlationId,
          timeoutMs,
        });

        res.status(408).json({
          status: 'error',
          statusCode: 408,
          message: 'Request timeout',
          correlationId: req.correlationId,
        });
      }
    }, timeoutMs);

    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};
