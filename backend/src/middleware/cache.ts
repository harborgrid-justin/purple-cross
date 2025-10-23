import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';
import { CACHE_TTL } from '../config/redis';
import { logger } from '../config/logger';

/**
 * Cache middleware options
 */
interface CacheMiddlewareOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  condition?: (req: Request) => boolean;
}

/**
 * Default key generator for cache middleware
 */
function defaultKeyGenerator(req: Request): string {
  const { method, path, query } = req;
  const queryString = Object.keys(query)
    .sort()
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  return `cache:${method}:${path}${queryString ? `:${queryString}` : ''}`;
}

/**
 * Cache middleware for Express routes
 * Caches GET requests by default
 */
export function cacheMiddleware(options: CacheMiddlewareOptions = {}) {
  const {
    ttl = CACHE_TTL.MEDIUM,
    keyGenerator = defaultKeyGenerator,
    condition = (req: Request) => req.method === 'GET',
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache if condition is met
    if (!condition(req)) {
      return next();
    }

    const cacheKey = keyGenerator(req);

    try {
      // Try to get from cache
      const cached = await cacheService.get<unknown>(cacheKey);

      if (cached !== null) {
        logger.debug('Cache middleware hit', { key: cacheKey });

        // Send cached response
        res.set('X-Cache', 'HIT');
        res.json(cached);
        return;
      }

      logger.debug('Cache middleware miss', { key: cacheKey });

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache the response
      res.json = function (body: unknown): Response {
        // Cache the response
        cacheService.set(cacheKey, body, ttl).catch((err) => {
          logger.error('Failed to cache response', {
            key: cacheKey,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        });

        // Send response with cache header
        res.set('X-Cache', 'MISS');
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', {
        key: cacheKey,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Continue without caching on error
      next();
    }
  };
}

/**
 * Create a cache key for specific entity
 */
export function createEntityCacheKey(prefix: string, id: string, suffix?: string): string {
  return `${prefix}${id}${suffix ? `:${suffix}` : ''}`;
}

/**
 * Create a cache key for list queries
 */
export function createListCacheKey(prefix: string, filters: Record<string, unknown>): string {
  const filterString = Object.keys(filters)
    .sort()
    .map((key) => `${key}=${filters[key]}`)
    .join(':');

  return `${prefix}list${filterString ? `:${filterString}` : ''}`;
}
