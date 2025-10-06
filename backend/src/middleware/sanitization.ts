import { Request, Response, NextFunction } from 'express';

/**
 * Sanitization middleware to prevent XSS and other injection attacks
 * Implements defense-in-depth security strategy
 */

/**
 * Recursively sanitize an object by escaping HTML and removing dangerous patterns
 */
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Remove null bytes
    let sanitized = value.replace(/\0/g, '');

    // Escape HTML special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }

  return value;
}

/**
 * Sanitize request body, query, and params
 */
export const sanitizationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // Skip sanitization for health and metrics endpoints
  if (req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
    return next();
  }

  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  // Sanitize route parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  next();
};

/**
 * Validate that string doesn't contain SQL injection patterns
 */
export function containsSQLInjection(value: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(;|--|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /('|"|`).*(\bOR\b|\bAND\b).*('|"|`)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(value));
}

/**
 * Validate that string doesn't contain NoSQL injection patterns
 */
export function containsNoSQLInjection(value: string): boolean {
  const noSqlPatterns = [/\$where/i, /\$ne/i, /\$gt/i, /\$lt/i, /\$regex/i];

  return noSqlPatterns.some((pattern) => pattern.test(value));
}
