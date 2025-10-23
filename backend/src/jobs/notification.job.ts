import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { notificationsQueue } from '../config/queue';

export interface NotificationJobData {
  type:
    | 'appointment_confirmed'
    | 'appointment_cancelled'
    | 'appointment_reminder'
    | 'payment_received'
    | 'invoice_due'
    | 'lab_results_ready'
    | 'prescription_ready'
    | 'system_alert'
    | 'custom';
  recipientId: string;
  recipientType: 'client' | 'staff';
  title: string;
  message: string;
  actionUrl?: string;
  icon?: string;
  channels: Array<'push' | 'in_app' | 'email'>;
  metadata?: Record<string, unknown>;
  priority?: number;
  expiresAt?: Date;
}

/**
 * Process a notification job from the queue
 */
export async function processNotificationJob(
  job: Job<NotificationJobData>
): Promise<void> {
  const { type, recipientId, recipientType, channels, title } = job.data;

  logger.info('Processing notification job', {
    jobId: job.id,
    type,
    recipientId,
    recipientType,
    channels,
  });

  try {
    await job.updateProgress(10);

    // TODO: Validate recipient exists
    logger.info('Validating recipient', {
      jobId: job.id,
      recipientId,
    });

    await job.updateProgress(20);

    // Send push notification if requested
    if (channels.includes('push')) {
      // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
      logger.info('Sending push notification', {
        jobId: job.id,
        recipientId,
        title,
      });

      // Simulate push notification
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await job.updateProgress(50);

    // Create in-app notification if requested
    if (channels.includes('in_app')) {
      // TODO: Store in-app notification in database
      logger.info('Creating in-app notification', {
        jobId: job.id,
        recipientId,
        type,
      });

      // Simulate database write
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    await job.updateProgress(80);

    // Send email notification if requested
    if (channels.includes('email')) {
      // TODO: Queue email job or send directly
      logger.info('Sending email notification', {
        jobId: job.id,
        recipientId,
        type,
      });

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await job.updateProgress(100);

    logger.info('Notification sent successfully', {
      jobId: job.id,
      type,
      channels,
    });
  } catch (error) {
    logger.error('Failed to send notification', {
      jobId: job.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error; // Let BullMQ handle retries
  }
}

/**
 * Queue a notification for async delivery
 */
export async function queueNotification(data: NotificationJobData): Promise<string> {
  const job = await notificationsQueue.add('send-notification', data, {
    priority: data.priority || 5,
  });

  logger.info('Notification queued', {
    jobId: job.id,
    type: data.type,
    channels: data.channels,
  });

  return job.id || 'unknown';
}

/**
 * Queue multiple notifications at once (bulk operation)
 */
export async function queueBulkNotifications(
  notifications: NotificationJobData[]
): Promise<string[]> {
  const jobs = await Promise.all(notifications.map((data) => queueNotification(data)));

  logger.info('Bulk notifications queued', {
    count: notifications.length,
  });

  return jobs;
}
