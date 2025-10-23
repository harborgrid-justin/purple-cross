import Redis from 'ioredis';
import { logger } from './logger';

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times: number): number | null {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: true,
  lazyConnect: false,
};

// Create Redis client for caching
export const redisClient = new Redis(redisConfig);

// Redis client event handlers
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error', {
    error: err.message,
    stack: err.stack,
  });
});

redisClient.on('close', () => {
  logger.warn('Redis client connection closed');
});

redisClient.on('reconnecting', (delay: number) => {
  logger.info('Redis client reconnecting', { delay });
});

// Graceful shutdown handler
export async function closeRedisConnection(): Promise<void> {
  logger.info('Closing Redis connection...');
  await redisClient.quit();
  logger.info('Redis connection closed');
}

// Health check function
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    logger.error('Redis health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

// Cache key prefixes for organization
export const CACHE_PREFIXES = {
  PATIENT: 'patient:',
  CLIENT: 'client:',
  APPOINTMENT: 'appointment:',
  MEDICAL_RECORD: 'medical_record:',
  PRESCRIPTION: 'prescription:',
  INVENTORY: 'inventory:',
  INVOICE: 'invoice:',
  LAB_TEST: 'lab_test:',
  STAFF: 'staff:',
  ANALYTICS: 'analytics:',
  SEARCH: 'search:',
  SESSION: 'session:',
  RATE_LIMIT: 'rate_limit:',
} as const;

// Cache TTL values (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;
