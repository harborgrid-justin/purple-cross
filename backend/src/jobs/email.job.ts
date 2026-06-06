import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { emailQueue } from '../config/queue';
import { notificationService } from '../integrations/notification.service';

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

    // Render a body from the job context. A full template engine can replace
    // this later; the resilient transport below is provider-agnostic.
    const { context } = job.data;
    const text =
      typeof context.text === 'string'
        ? context.text
        : typeof context.body === 'string'
          ? context.body
          : `You have a new ${template} notification.`;
    const html = typeof context.html === 'string' ? context.html : undefined;

    await job.updateProgress(40);

    // Send through the resilient facade (circuit breaker + retry + metrics).
    const result = await notificationService.sendEmail({ to, subject, text, html });

    await job.updateProgress(100);

    logger.info('Email sent successfully', {
      jobId: job.id,
      template,
      provider: result.provider,
      messageId: result.messageId,
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
