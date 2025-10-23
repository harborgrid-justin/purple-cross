import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { emailQueue } from '../config/queue';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, unknown>;
  priority?: number;
}

/**
 * Process an email job from the queue
 */
export async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const { to, subject, template } = job.data;

  logger.info('Processing email job', {
    jobId: job.id,
    to: Array.isArray(to) ? to.length : 1,
    template,
  });

  try {
    await job.updateProgress(10);

    // TODO: Implement actual email sending
    // For now, just log the email
    logger.info('Email would be sent', {
      to,
      subject,
      template,
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    await job.updateProgress(100);

    logger.info('Email sent successfully', {
      jobId: job.id,
      template,
    });
  } catch (error) {
    logger.error('Failed to send email', {
      jobId: job.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error; // Let BullMQ handle retries
  }
}

/**
 * Queue an email for async processing
 */
export async function queueEmail(data: EmailJobData): Promise<string> {
  const job = await emailQueue.add('send-email', data, {
    priority: data.priority || 5,
  });

  logger.info('Email queued', {
    jobId: job.id,
    template: data.template,
  });

  return job.id || 'unknown';
}
