import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { HTTP_STATUS, ERROR_MESSAGES, TIME } from '../constants';

/**
 * Middleware to handle request timeouts
 * Prevents hung requests from consuming resources
 */
export const timeoutMiddleware = (timeoutMs: number = TIME.DEFAULT_REQUEST_TIMEOUT) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set timeout for the request
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.error({
          message: ERROR_MESSAGES.REQUEST_TIMEOUT,
          path: req.path,
          method: req.method,
          correlationId: req.correlationId,
          timeoutMs,
        });

        res.status(HTTP_STATUS.REQUEST_TIMEOUT).json({
          status: 'error',
          statusCode: HTTP_STATUS.REQUEST_TIMEOUT,
          message: ERROR_MESSAGES.REQUEST_TIMEOUT,
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
