import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Custom error class with error codes for better error tracking
 * Follows Google's error handling best practices
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorCode: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = errorCode || this.generateErrorCode(statusCode);

    Error.captureStackTrace(this, this.constructor);
  }

  private generateErrorCode(statusCode: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };
    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    errorCode = err.errorCode;
  }

  // Log error with correlation ID for distributed tracing
  logger.error({
    message: err.message,
    statusCode,
    errorCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
    isOperational,
    timestamp: new Date().toISOString(),
  });

  // Send structured error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    errorCode,
    message,
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      path: req.path,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  logger.warn({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    correlationId: req.correlationId,
  });

  res.status(404).json({
    status: 'error',
    statusCode: 404,
    errorCode: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
  });
};
