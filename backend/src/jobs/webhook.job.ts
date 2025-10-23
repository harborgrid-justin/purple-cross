import { Job } from 'bullmq';
import axios, { AxiosError } from 'axios';
import { logger } from '../config/logger';
import { webhookService } from '../services/webhook.service';
import { webhookDeliveryService } from '../services/webhook-delivery.service';
import { webhooksQueue } from '../config/queue';

export interface WebhookPayload {
  webhookId: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  deliveryId?: string;
}

/**
 * Queue a webhook delivery job
 */
export async function queueWebhook(
  webhookId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  // Create delivery record
  const delivery = await webhookDeliveryService.createDelivery({
    webhookId,
    event,
    payload: data,
  });

  const payload: WebhookPayload = {
    webhookId,
    event,
    data,
    timestamp: new Date().toISOString(),
    deliveryId: delivery.id,
  };

  await webhooksQueue.add(`webhook-${event}`, payload, {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // Start with 5 seconds
    },
  });

  logger.info('Webhook queued for delivery', { webhookId, event, deliveryId: delivery.id });
}

/**
 * Process webhook delivery job
 * Sends webhook payload to the configured URL with retry logic
 */
export async function processWebhookJob(job: Job<WebhookPayload>): Promise<void> {
  const { webhookId, event, data, timestamp, deliveryId } = job.data;

  logger.info('Processing webhook delivery', {
    jobId: job.id,
    webhookId,
    event,
    deliveryId,
    attempt: job.attemptsMade,
  });

  const startTime = Date.now();

  try {
    // Get webhook configuration
    const webhook = await webhookService.getWebhookById(webhookId);

    if (!webhook.active) {
      logger.warn('Webhook is inactive, skipping delivery', { webhookId });
      
      // Update delivery status
      if (deliveryId) {
        await webhookDeliveryService.updateDeliveryStatus(deliveryId, {
          status: 'failed',
          errorMessage: 'Webhook is inactive',
        });
      }
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

    const duration = Date.now() - startTime;

    // Update delivery status as success
    if (deliveryId) {
      await webhookDeliveryService.updateDeliveryStatus(deliveryId, {
        status: 'success',
        statusCode: response.status,
        responseBody: JSON.stringify(response.data).substring(0, 1000), // Limit size
        deliveredAt: new Date(),
      });
    }

    logger.info('Webhook delivered successfully', {
      jobId: job.id,
      webhookId,
      event,
      deliveryId,
      status: response.status,
      url: webhook.url,
      duration: `${duration}ms`,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Update delivery status as failed
      if (deliveryId) {
        const nextRetryDelay = Math.min(5000 * Math.pow(2, job.attemptsMade), 300000); // Max 5 minutes
        const nextRetryAt = new Date(Date.now() + nextRetryDelay);
        
        await webhookDeliveryService.updateDeliveryStatus(deliveryId, {
          status: job.attemptsMade >= 3 ? 'failed' : 'pending',
          statusCode: axiosError.response?.status,
          errorMessage: axiosError.message,
          nextRetryAt: job.attemptsMade < 3 ? nextRetryAt : undefined,
        });
        
        if (job.attemptsMade < 3) {
          await webhookDeliveryService.incrementAttempt(deliveryId);
        }
      }
      
      logger.error('Webhook delivery failed', {
        jobId: job.id,
        webhookId,
        event,
        deliveryId,
        status: axiosError.response?.status,
        message: axiosError.message,
        attempt: job.attemptsMade,
      });

      // Throw error to trigger retry
      throw new Error(`Webhook delivery failed: ${axiosError.response?.status || 'Network error'}`);
    }

    // Update delivery status for other errors
    if (deliveryId) {
      await webhookDeliveryService.updateDeliveryStatus(deliveryId, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    logger.error('Webhook processing error', {
      jobId: job.id,
      webhookId,
      event,
      deliveryId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}
