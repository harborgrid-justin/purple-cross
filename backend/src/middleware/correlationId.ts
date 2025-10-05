import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

/**
 * Middleware to add correlation ID to each request for distributed tracing
 * Follows Google's best practices for observability
 */
export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Use existing correlation ID from header or generate a new one
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    randomUUID();

  req.correlationId = correlationId;

  // Add correlation ID to response headers for client tracking
  res.setHeader('X-Correlation-ID', correlationId);

  next();
};
