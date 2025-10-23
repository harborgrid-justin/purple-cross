import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS } from '../constants';
import crypto from 'crypto';

interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
  active?: boolean;
}

interface UpdateWebhookData {
  name?: string;
  url?: string;
  events?: string[];
  active?: boolean;
}

interface GetWebhooksOptions {
  page?: number;
  limit?: number;
  active?: boolean;
}

export class WebhookService {
  /**
   * Create a new webhook subscription
   */
  async createWebhook(data: CreateWebhookData) {
    // Validate URL format
    try {
      new URL(data.url);
    } catch {
      throw new AppError('Invalid webhook URL format', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate events array
    if (!data.events || data.events.length === 0) {
      throw new AppError('At least one event must be specified', HTTP_STATUS.BAD_REQUEST);
    }

    // Generate a secure secret for webhook signature
    const secret = this.generateSecret();

    const webhook = await prisma.webhookSubscription.create({
      data: {
        name: data.name,
        url: data.url,
        events: data.events,
        secret,
        active: data.active ?? true,
      },
    });

    return webhook;
  }

  /**
   * Get webhook by ID
   */
  async getWebhookById(id: string) {
    const webhook = await prisma.webhookSubscription.findUnique({
      where: { id },
    });

    if (!webhook) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Webhook'), HTTP_STATUS.NOT_FOUND);
    }

    return webhook;
  }

  /**
   * Get all webhooks with optional filtering
   */
  async getWebhooks(options: GetWebhooksOptions = {}) {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, active } = options;

    const skip = (page - 1) * limit;

    const where = active !== undefined ? { active } : {};

    const [webhooks, total] = await Promise.all([
      prisma.webhookSubscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      prisma.webhookSubscription.count({ where }),
    ]);

    return {
      webhooks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a webhook subscription
   */
  async updateWebhook(id: string, data: UpdateWebhookData) {
    // Check if webhook exists
    await this.getWebhookById(id);

    // Validate URL if provided
    if (data.url) {
      try {
        new URL(data.url);
      } catch {
        throw new AppError('Invalid webhook URL format', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate events array if provided
    if (data.events && data.events.length === 0) {
      throw new AppError('At least one event must be specified', HTTP_STATUS.BAD_REQUEST);
    }

    const webhook = await prisma.webhookSubscription.update({
      where: { id },
      data,
    });

    return webhook;
  }

  /**
   * Delete a webhook subscription
   */
  async deleteWebhook(id: string): Promise<void> {
    // Check if webhook exists
    await this.getWebhookById(id);

    await prisma.webhookSubscription.delete({
      where: { id },
    });
  }

  /**
   * Regenerate webhook secret
   */
  async regenerateSecret(id: string) {
    // Check if webhook exists
    await this.getWebhookById(id);

    const secret = this.generateSecret();

    const webhook = await prisma.webhookSubscription.update({
      where: { id },
      data: { secret },
    });

    return webhook;
  }

  /**
   * Get webhooks subscribed to a specific event
   */
  async getWebhooksByEvent(event: string) {
    const webhooks = await prisma.webhookSubscription.findMany({
      where: {
        active: true,
        events: {
          has: event,
        },
      },
    });

    return webhooks;
  }

  /**
   * Generate a secure random secret for webhook signatures
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);

    // Check if signatures have same length before comparing
    if (signature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}

export const webhookService = new WebhookService();
