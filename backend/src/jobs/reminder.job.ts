import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { remindersQueue } from '../config/queue';

export interface ReminderJobData {
  type: 'appointment' | 'medication' | 'vaccination' | 'followup' | 'payment';
  recipientType: 'client' | 'staff';
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'email' | 'sms' | 'both';
  subject?: string;
  message: string;
  scheduledFor?: Date;
  metadata?: {
    appointmentId?: string;
    patientId?: string;
    prescriptionId?: string;
    invoiceId?: string;
  };
  priority?: number;
}

/**
 * Process a reminder job from the queue
 */
export async function processReminderJob(job: Job<ReminderJobData>): Promise<void> {
  const { type, recipientType, recipientId, channel } = job.data;

  logger.info('Processing reminder job', {
    jobId: job.id,
    type,
    recipientType,
    recipientId,
    channel,
  });

  try {
    await job.updateProgress(10);

    // TODO: Validate recipient exists and has valid contact info
    logger.info('Validating recipient', {
      jobId: job.id,
      recipientId,
    });

    await job.updateProgress(30);

    // Send via email if requested
    if (channel === 'email' || channel === 'both') {
      if (!job.data.recipientEmail) {
        logger.warn('Email channel requested but no email provided', {
          jobId: job.id,
          recipientId,
        });
      } else {
        // TODO: Integrate with email service or queue email job
        logger.info('Sending reminder via email', {
          jobId: job.id,
          email: job.data.recipientEmail,
          type,
        });

        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    await job.updateProgress(60);

    // Send via SMS if requested
    if (channel === 'sms' || channel === 'both') {
      if (!job.data.recipientPhone) {
        logger.warn('SMS channel requested but no phone provided', {
          jobId: job.id,
          recipientId,
        });
      } else {
        // TODO: Integrate with SMS service (Twilio)
        logger.info('Sending reminder via SMS', {
          jobId: job.id,
          phone: job.data.recipientPhone,
          type,
        });

        // Simulate SMS sending
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    await job.updateProgress(100);

    logger.info('Reminder sent successfully', {
      jobId: job.id,
      type,
      channel,
    });
  } catch (error) {
    logger.error('Failed to send reminder', {
      jobId: job.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error; // Let BullMQ handle retries
  }
}

/**
 * Queue a reminder for async delivery
 */
export async function queueReminder(data: ReminderJobData): Promise<string> {
  const delay = data.scheduledFor ? Math.max(0, data.scheduledFor.getTime() - Date.now()) : 0;

  const job = await remindersQueue.add('send-reminder', data, {
    priority: data.priority || 5,
    delay, // Schedule for future if scheduledFor is provided
  });

  logger.info('Reminder queued', {
    jobId: job.id,
    type: data.type,
    channel: data.channel,
    scheduledFor: data.scheduledFor,
    delay,
  });

  return job.id || 'unknown';
}

/**
 * Schedule multiple reminders at once (bulk operation)
 */
export async function queueBulkReminders(reminders: ReminderJobData[]): Promise<string[]> {
  const jobs = await Promise.all(reminders.map((data) => queueReminder(data)));

  logger.info('Bulk reminders queued', {
    count: reminders.length,
  });

  return jobs;
}
