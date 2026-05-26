import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import { fieldCryptoExtension } from './prisma-extensions/field-crypto';
import { softDeleteExtension } from './prisma-extensions/soft-delete';
import { auditExtension } from './prisma-extensions/audit';

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

// Base client: event logging is attached here, before extensions are applied.
const basePrisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  basePrisma.$on('query', (e: QueryEvent): void => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

basePrisma.$on('error', (e: LogEvent): void => {
  logger.error('Database error:', e);
});

basePrisma.$on('warn', (e: LogEvent): void => {
  logger.warn('Database warning:', e);
});

// Extended client used throughout the app. The export name is unchanged so the
// ~37 importers are untouched. Composition order matters:
//  - field-crypto innermost: ciphertext is what hits the DB and what the audit
//    layer logs; callers transparently get plaintext back.
//  - soft-delete: delete() physically becomes update(deletedAt).
//  - audit outermost: still logs the call as a delete and captures stamped data.
const prisma = basePrisma
  .$extends(fieldCryptoExtension)
  .$extends(softDeleteExtension)
  .$extends(auditExtension);

export type ExtendedPrismaClient = typeof prisma;

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
