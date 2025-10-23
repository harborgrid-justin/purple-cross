import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Prisma event types for type-safe event handlers
interface QueryEvent {
  query: string;
  duration: number;
  timestamp: Date;
}

interface LogEvent {
  message: string;
  target: string;
}

const prisma: PrismaClient = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: QueryEvent): void => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

prisma.$on('error', (e: LogEvent): void => {
  logger.error('Database error:', e);
});

prisma.$on('warn', (e: LogEvent): void => {
  logger.warn('Database warning:', e);
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}

export { prisma };
export default prisma;
