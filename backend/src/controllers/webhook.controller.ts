import { Request, Response } from 'express';
import { webhookService } from '../services/webhook.service';
import { HTTP_STATUS } from '../constants';

export class WebhookController {
  /**
   * Create a new webhook subscription
   */
  async createWebhook(req: Request, res: Response): Promise<void> {
    const webhook = await webhookService.createWebhook(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: webhook,
    });
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(req: Request, res: Response): Promise<void> {
    const webhook = await webhookService.getWebhookById(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: webhook,
    });
  }

  /**
   * Get all webhooks
   */
  async getWebhooks(req: Request, res: Response): Promise<void> {
    const { page, limit, active } = req.query;

    const result = await webhookService.getWebhooks({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      active: active === 'true' ? true : active === 'false' ? false : undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.webhooks,
      pagination: result.pagination,
    });
  }

  /**
   * Update a webhook subscription
   */
  async updateWebhook(req: Request, res: Response): Promise<void> {
    const webhook = await webhookService.updateWebhook(req.params.id, req.body);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: webhook,
    });
  }

  /**
   * Delete a webhook subscription
   */
  async deleteWebhook(req: Request, res: Response): Promise<void> {
    await webhookService.deleteWebhook(req.params.id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Regenerate webhook secret
   */
  async regenerateSecret(req: Request, res: Response): Promise<void> {
    const webhook = await webhookService.regenerateSecret(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: webhook,
    });
  }

  /**
   * Test webhook delivery
   */
  async testWebhook(req: Request, res: Response): Promise<void> {
    const webhook = await webhookService.getWebhookById(req.params.id);
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
  async getWebhookDeliveries(req: Request, res: Response): Promise<void> {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');
    const { page, limit, status, event } = req.query;

    const result = await webhookDeliveryService.getDeliveries({
      webhookId: req.params.id,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.deliveries,
      pagination: result.pagination,
    });
  }

  /**
   * Get webhook delivery statistics
   */
  async getWebhookStats(req: Request, res: Response): Promise<void> {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');

    const stats = await webhookDeliveryService.getDeliveryStats(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: stats,
    });
  }

  /**
   * Get all webhook deliveries (admin view)
   */
  async getAllDeliveries(req: Request, res: Response): Promise<void> {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');
    const { page, limit, status, event, webhookId } = req.query;

    const result = await webhookDeliveryService.getDeliveries({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
      webhookId: webhookId as string | undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.deliveries,
      pagination: result.pagination,
    });
  }

  /**
   * Get delivery analytics
   */
  async getDeliveryAnalytics(_req: Request, res: Response): Promise<void> {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service');

    const overallStats = await webhookDeliveryService.getDeliveryStats();

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: overallStats,
    });
  }
}

export const webhookController = new WebhookController();
