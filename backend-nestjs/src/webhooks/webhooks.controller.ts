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
  @Post()
  async createWebhook(@Body() body: any) {
    const webhook = await this.webhooksService.createWebhook(body);

    return webhook;
  }

  /**
   * Get webhook by ID
   */
  @Get(':id')
  async getWebhook(@Param('id', ParseUUIDPipe) id: string) {
    const webhook = await this.webhooksService.getWebhookById(id);

    return webhook;
  }

  /**
   * Get all webhooks
   */
  @Get()
  async getWebhooks(@Query() query: any) {
    const { page, limit, active } = query;

    const result = await this.webhooksService.getWebhooks({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      active: active === 'true' ? true : active === 'false' ? false : undefined,
    });

    return {
      webhooks: result.webhooks,
      pagination: result.pagination,
    };
  }

  /**
   * Update a webhook subscription
   */
  @Put(':id')
  async updateWebhook(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const webhook = await this.webhooksService.updateWebhook(id, body);

    return webhook;
  }

  /**
   * Delete a webhook subscription
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWebhook(@Param('id', ParseUUIDPipe) id: string) {
    await this.webhooksService.deleteWebhook(id);
  }

  /**
   * Regenerate webhook secret
   */
  @Post(':id/regenerate-secret')
  async regenerateSecret(@Param('id', ParseUUIDPipe) id: string) {
    const webhook = await this.webhooksService.regenerateSecret(id);

    return webhook;
  }

  /**
   * Test webhook delivery
   */
  @Post(':id/test')
  async testWebhook(@Param('id', ParseUUIDPipe) id: string) {
    const webhook = await this.webhooksService.getWebhookById(id);
    const { queueWebhook } = await import('../jobs.js');

    // Queue a test webhook
    await queueWebhook(webhook.id, 'webhook.test', {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test webhook delivery',
    });

    return {
      status: 'success',
      message: 'Test webhook queued for delivery',
      data: {
        webhookId: webhook.id,
        url: webhook.url,
      },
    };
  }

  /**
   * Get webhook deliveries
   */
  @Get(':id/deliveries')
  async getWebhookDeliveries(@Param('id', ParseUUIDPipe) id: string, @Query() query: any) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service.js');
    const { page, limit, status, event } = query;

    const result = await webhookDeliveryService.getDeliveries({
      webhookId: id,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
    });

    return {
      deliveries: result.deliveries,
      pagination: result.pagination,
    };
  }

  /**
   * Get webhook delivery statistics
   */
  @Get(':id/stats')
  async getWebhookStats(@Param('id', ParseUUIDPipe) id: string) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service.js');

    const stats = await webhookDeliveryService.getDeliveryStats(id);

    return stats;
  }

  /**
   * Get all webhook deliveries (admin view)
   */
  @Get('deliveries/all')
  async getAllDeliveries(@Query() query: any) {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service.js');
    const { page, limit, status, event, webhookId } = query;

    const result = await webhookDeliveryService.getDeliveries({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      event: event as string | undefined,
      webhookId: webhookId as string | undefined,
    });

    return {
      deliveries: result.deliveries,
      pagination: result.pagination,
    };
  }

  /**
   * Get delivery analytics
   */
  @Get('analytics/deliveries')
  async getDeliveryAnalytics() {
    const { webhookDeliveryService } = await import('../services/webhook-delivery.service.js');

    const overallStats = await webhookDeliveryService.getDeliveryStats();

    return overallStats;
  }
}

