import { Queue, QueueOptions } from 'bullmq';

// Queue names as constants
export const QUEUES = {
  EMAIL: 'email',
  REPORTS: 'reports',
  REMINDERS: 'reminders',
  NOTIFICATIONS: 'notifications',
  WEBHOOKS: 'webhooks',
} as const;

// Redis connection configuration for BullMQ
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Default job options with retry logic
const defaultJobOptions: QueueOptions['defaultJobOptions'] = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: {
    count: 100,
    age: 86400, // 24 hours
  },
  removeOnFail: {
    count: 500,
  },
};

// Email queue - for sending emails asynchronously
export const emailQueue = new Queue(QUEUES.EMAIL, {
  connection: redisConnection,
  defaultJobOptions,
});

// Reports queue - for generating reports
export const reportsQueue = new Queue(QUEUES.REPORTS, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 1, // Reports shouldn't retry
  },
});

// Reminders queue - for sending appointment/medication reminders
export const remindersQueue = new Queue(QUEUES.REMINDERS, {
  connection: redisConnection,
  defaultJobOptions,
});

// Notifications queue - for push notifications
export const notificationsQueue = new Queue(QUEUES.NOTIFICATIONS, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 2, // Fewer retries for notifications
  },
});

// Webhooks queue - for webhook delivery with retry
export const webhooksQueue = new Queue(QUEUES.WEBHOOKS, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultJobOptions,
    attempts: 5, // More retries for webhooks
    backoff: {
      type: 'exponential',
      delay: 5000, // Start with 5 second delay
    },
  },
});
