import { Job } from 'bullmq';
import axios, { AxiosError } from 'axios';
import { logger } from '../config/logger';
import { webhookService } from '../services/webhook.service';
import { webhooksQueue } from '../config/queue';

export interface WebhookPayload {
  webhookId: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

/**
 * Queue a webhook delivery job
 */
export async function queueWebhook(
  webhookId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const payload: WebhookPayload = {
    webhookId,
    event,
    data,
    timestamp: new Date().toISOString(),
  };

  await webhooksQueue.add(`webhook-${event}`, payload, {
    removeOnComplete: true,
    removeOnFail: false,
  });

  logger.info('Webhook queued for delivery', { webhookId, event });
}

/**
 * Process webhook delivery job
 * Sends webhook payload to the configured URL with retry logic
 */
export async function processWebhookJob(job: Job<WebhookPayload>): Promise<void> {
  const { webhookId, event, data, timestamp } = job.data;

  logger.info('Processing webhook delivery', {
    jobId: job.id,
    webhookId,
    event,
    attempt: job.attemptsMade,
  });

  try {
    // Get webhook configuration
    const webhook = await webhookService.getWebhookById(webhookId);

    if (!webhook.active) {
      logger.warn('Webhook is inactive, skipping delivery', { webhookId });
      return;
    }

    // Prepare payload
    const payload = {
      event,
      data,
      timestamp,
      webhookId,
    };

    const payloadString = JSON.stringify(payload);

    // Generate signature
    const signature = webhookService.generateSignature(payloadString, webhook.secret);

    // Send webhook request
    const response = await axios.post(webhook.url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
        'User-Agent': 'Purple-Cross-Webhooks/1.0',
      },
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status >= 200 && status < 300,
    });

    logger.info('Webhook delivered successfully', {
      jobId: job.id,
      webhookId,
      event,
      status: response.status,
      url: webhook.url,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      logger.error('Webhook delivery failed', {
        jobId: job.id,
        webhookId,
        event,
        status: axiosError.response?.status,
        message: axiosError.message,
        attempt: job.attemptsMade,
      });

      // Throw error to trigger retry
      throw new Error(`Webhook delivery failed: ${axiosError.response?.status || 'Network error'}`);
    }

    logger.error('Webhook processing error', {
      jobId: job.id,
      webhookId,
      event,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}
