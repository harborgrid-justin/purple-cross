import { Worker } from 'bullmq';
import { QUEUES } from './config/queue';
import { processEmailJob } from './jobs/email.job';
import { processReportJob } from './jobs/report.job';
import { processReminderJob } from './jobs/reminder.job';
import { processNotificationJob } from './jobs/notification.job';
import { processWebhookJob } from './jobs/webhook.job';
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

// Reports worker
const reportsWorker = new Worker(QUEUES.REPORTS, processReportJob, {
  connection: redisConnection,
  concurrency: 2, // Reports are more resource-intensive, lower concurrency
});

// Reminders worker
const remindersWorker = new Worker(QUEUES.REMINDERS, processReminderJob, {
  connection: redisConnection,
  concurrency: 10, // Reminders are lightweight, higher concurrency
});

// Notifications worker
const notificationsWorker = new Worker(QUEUES.NOTIFICATIONS, processNotificationJob, {
  connection: redisConnection,
  concurrency: 10, // Notifications are lightweight, higher concurrency
});

// Webhooks worker
const webhooksWorker = new Worker(QUEUES.WEBHOOKS, processWebhookJob, {
  connection: redisConnection,
  concurrency: 5, // Moderate concurrency for webhooks
});

// Helper function to set up worker event handlers
function setupWorkerHandlers(worker: Worker, name: string): void {
  worker.on('completed', (job) => {
    logger.info(`${name} job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`${name} job ${job?.id} failed`, {
      error: err.message,
      stack: err.stack,
      jobData: job?.data,
    });
  });

  worker.on('error', (err) => {
    logger.error(`${name} worker error`, {
      error: err.message,
      stack: err.stack,
    });
  });

  worker.on('stalled', (jobId) => {
    logger.warn(`${name} job ${jobId} stalled`);
  });
}

// Set up event handlers for all workers
setupWorkerHandlers(emailWorker, 'Email');
setupWorkerHandlers(reportsWorker, 'Reports');
setupWorkerHandlers(remindersWorker, 'Reminders');
setupWorkerHandlers(notificationsWorker, 'Notifications');
setupWorkerHandlers(webhooksWorker, 'Webhooks');

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info('Shutting down workers...');

  await Promise.all([
    emailWorker.close(),
    reportsWorker.close(),
    remindersWorker.close(),
    notificationsWorker.close(),
    webhooksWorker.close(),
  ]);

  logger.info('Workers shut down successfully');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

logger.info('Workers started', {
  queues: [QUEUES.EMAIL, QUEUES.REPORTS, QUEUES.REMINDERS, QUEUES.NOTIFICATIONS, QUEUES.WEBHOOKS],
});
