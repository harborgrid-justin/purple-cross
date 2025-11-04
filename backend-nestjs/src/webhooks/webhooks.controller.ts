import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { WebhookService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhookService) {}
  /**
   * Create a new webhook subscription
   */
  async createWebhook(req: Request, res: Response) {
    const webhook = await webhookService.createWebhook(body);

    return webhook;
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(req: Request, res: Response) {
    const webhook = await webhookService.getWebhookById(id);

    return webhook;
  }

  /**
   * Get all webhooks
   */
  async getWebhooks(req: Request, res: Response) {
    const { page, limit, active } = query;

    const result = await webhookService.getWebhooks({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      active: active === 'true' ? true : active === 'false' ? false : undefined,
    });

    return result.webhooks,
      pagination: result.pagination,
    ;
  }

  /**
   * Update a webhook subscription
   */
  async updateWebhook(req: Request, res: Response) {
    const webhook = await webhookService.updateWebhook(id, body);

    return webhook;
  }

  /**
   * Delete a webhook subscription
   */
  async deleteWebhook(req: Request, res: Response) {
    await webhookService.deleteWebhook(id);

    return;
  }

  /**
   * Regenerate webhook secret
   */
  async regenerateSecret(req: Request, res: Response) {
    const webhook = await webhookService.regenerateSecret(id);

    return webhook;
  }

  /**
   * Test webhook delivery
   */
  async testWebhook(req: Request, res: Response) {
    const webhook = await webhookService.getWebhookById(id);
    const { queueWebhook } = await import('../jobs');

    // Queue a test webhook
    await queueWebhook(webhook.id, 'webhook.test', {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test webhook delivery',
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Test webhook queued for delivery',
      data: {
        webhookId: webhook.id,
        url: webhook.url,
      },
    });
  }

  /**
   * Get webhook deliveries
   */
  async getWebhookDeliveries(req: Request, res: Response) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');
    const { page, limit, status, event } = query;

    const result = await webhookDeliveryService.getDeliveries({
      webhookId: id,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
    });

    return result.deliveries,
      pagination: result.pagination,
    ;
  }

  /**
   * Get webhook delivery statistics
   */
  async getWebhookStats(req: Request, res: Response) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');

    const stats = await webhookDeliveryService.getDeliveryStats(id);

    return stats;
  }

  /**
   * Get all webhook deliveries (admin view)
   */
  async getAllDeliveries(req: Request, res: Response) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');
    const { page, limit, status, event, webhookId } = query;

    const result = await webhookDeliveryService.getDeliveries({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
      webhookId: webhookId as string | undefined,
    });

    return result.deliveries,
      pagination: result.pagination,
    ;
  }

  /**
   * Get delivery analytics
   */
  async getDeliveryAnalytics(_req: Request, res: Response) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');

    const overallStats = await webhookDeliveryService.getDeliveryStats();

    return overallStats;
  }
}

