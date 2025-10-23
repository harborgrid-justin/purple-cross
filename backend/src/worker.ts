import { Worker } from 'bullmq';
import { QUEUES } from './config/queue';
import { processEmailJob } from './jobs/email.job';
import { logger } from './config/logger';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Email worker
const emailWorker = new Worker(QUEUES.EMAIL, processEmailJob, {
  connection: redisConnection,
  concurrency: 5, // Process 5 jobs concurrently
});

// Worker event handlers
emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed`, {
    error: err.message,
    stack: err.stack,
  });
});

emailWorker.on('error', (err) => {
  logger.error('Worker error', {
    error: err.message,
  });
});

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down workers...');

  await emailWorker.close();

  logger.info('Workers shut down successfully');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

logger.info('Workers started', {
  queues: [QUEUES.EMAIL],
});
