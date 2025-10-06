import rateLimit from 'express-rate-limit';
import env from '../config/env';
import { logger } from '../config/logger';
import { HTTP_STATUS, ERROR_MESSAGES, TIME, RATE_LIMIT, HEALTH_PATHS } from '../constants';

/**
 * Rate limiting middleware to prevent abuse
 * Implements token bucket algorithm for request throttling
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 'error',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  },
  handler: (req, res) => {
    logger.warn({
      message: 'Rate limit exceeded',
      ip: req.ip,
      path: req.path,
      correlationId: req.correlationId,
    });
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      status: 'error',
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return (
      req.path === HEALTH_PATHS.HEALTH ||
      req.path === HEALTH_PATHS.READY ||
      req.path === HEALTH_PATHS.LIVE
    );
  },
});

/**
 * Stricter rate limiting for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: TIME.AUTH_RATE_LIMIT_WINDOW,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  skipSuccessfulRequests: RATE_LIMIT.AUTH_SKIP_SUCCESSFUL,
  message: {
    status: 'error',
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: ERROR_MESSAGES.AUTH_RATE_LIMIT_EXCEEDED,
  },
});
