import { redisClient, CACHE_PREFIXES, CACHE_TTL } from '../config/redis';
import { logger } from '../config/logger';

/**
 * Cache Service
 * Provides a high-level interface for caching operations with Redis
 */
export class CacheService {
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Set a value in cache with TTL
   */
  async set(key: string, value: unknown, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.setex(key, ttl, serialized);

      logger.debug('Cache set', { key, ttl });
    } catch (error) {
      logger.error('Cache set error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete a value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
      logger.debug('Cache deleted', { key });
    } catch (error) {
      logger.error('Cache delete error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        logger.debug('Cache pattern deleted', { pattern, count: keys.length });
      }
    } catch (error) {
      logger.error('Cache pattern delete error', {
        pattern,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute callback and cache the result
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      logger.debug('Cache hit', { key });
      return cached;
    }

    // Cache miss - execute callback
    logger.debug('Cache miss', { key });
    const result = await callback();

    // Store in cache
    await this.set(key, result, ttl);

    return result;
  }

  /**
   * Increment a counter
   */
  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const value = await redisClient.incr(key);

      if (ttl && value === 1) {
        // Set TTL only on first increment
        await redisClient.expire(key, ttl);
      }

      return value;
    } catch (error) {
      logger.error('Cache increment error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 0;
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(entries: Record<string, unknown>, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      const pipeline = redisClient.pipeline();

      Object.entries(entries).forEach(([key, value]) => {
        const serialized = JSON.stringify(value);
        pipeline.setex(key, ttl, serialized);
      });

      await pipeline.exec();
      logger.debug('Cache mset', { count: Object.keys(entries).length });
    } catch (error) {
      logger.error('Cache mset error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get multiple values at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await redisClient.mget(...keys);
      return values.map((value) => (value ? (JSON.parse(value) as T) : null));
    } catch (error) {
      logger.error('Cache mget error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return keys.map(() => null);
    }
  }

  /**
   * Clear all cache entries matching a prefix
   */
  async clearPrefix(prefix: string): Promise<void> {
    await this.delPattern(`${prefix}*`);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    keys: number;
    memory: string;
    hitRate?: number;
  }> {
    try {
      const info = await redisClient.info('stats');
      const dbsize = await redisClient.dbsize();
      const memory = await redisClient.info('memory');

      // Parse memory info
      const memoryMatch = memory.match(/used_memory_human:(.+)/);
      const memoryUsed = memoryMatch ? memoryMatch[1].trim() : 'unknown';

      // Parse hit rate
      const hitsMatch = info.match(/keyspace_hits:(\d+)/);
      const missesMatch = info.match(/keyspace_misses:(\d+)/);
      let hitRate: number | undefined;

      if (hitsMatch && missesMatch) {
        const hits = parseInt(hitsMatch[1]);
        const misses = parseInt(missesMatch[1]);
        const total = hits + misses;
        hitRate = total > 0 ? (hits / total) * 100 : 0;
      }

      return {
        keys: dbsize,
        memory: memoryUsed,
        hitRate,
      };
    } catch (error) {
      logger.error('Cache stats error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return {
        keys: 0,
        memory: 'unknown',
      };
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

/**
 * Cache invalidation helpers for specific entities
 */
export const cacheInvalidation = {
  patient: async (patientId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.PATIENT}${patientId}`);
  },

  client: async (clientId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.CLIENT}${clientId}`);
  },

  appointment: async (appointmentId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.APPOINTMENT}${appointmentId}`);
  },

  medicalRecord: async (recordId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.MEDICAL_RECORD}${recordId}`);
  },

  prescription: async (prescriptionId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.PRESCRIPTION}${prescriptionId}`);
  },

  inventory: async (itemId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.INVENTORY}${itemId}`);
  },

  invoice: async (invoiceId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.INVOICE}${invoiceId}`);
  },

  labTest: async (labTestId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.LAB_TEST}${labTestId}`);
  },

  staff: async (staffId: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.STAFF}${staffId}`);
  },

  analytics: async (): Promise<void> => {
    await cacheService.clearPrefix(CACHE_PREFIXES.ANALYTICS);
  },

  search: async (query: string): Promise<void> => {
    await cacheService.clearPrefix(`${CACHE_PREFIXES.SEARCH}${query}`);
  },
};
