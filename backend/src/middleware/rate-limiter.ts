import rateLimit from 'express-rate-limit';
import env from '../config/env';
import { logger } from '../config/logger';

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
    statusCode: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
  handler: (req, res) => {
    logger.warn({
      message: 'Rate limit exceeded',
      ip: req.ip,
      path: req.path,
      correlationId: req.correlationId,
    });
    res.status(429).json({
      status: 'error',
      statusCode: 429,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/health/ready' || req.path === '/health/live';
  },
});

/**
 * Stricter rate limiting for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many authentication attempts, please try again later.',
  },
});
