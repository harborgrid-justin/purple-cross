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

    // This will be handled by the webhook delivery system
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Test webhook queued for delivery',
      data: {
        webhookId: webhook.id,
        url: webhook.url,
      },
    });
  }
}

export const webhookController = new WebhookController();
