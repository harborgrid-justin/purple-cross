import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS } from '../constants';

interface GetWebhookDeliveriesOptions {
  webhookId?: string;
  status?: string;
  event?: string;
  page?: number;
  limit?: number;
}

interface WebhookDeliveryStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  successRate: number;
  averageResponseTime?: number;
}

export class WebhookDeliveryService {
  /**
   * Create a webhook delivery record
   */
  async createDelivery(data: {
    webhookId: string;
    event: string;
    payload: Record<string, unknown>;
    maxAttempts?: number;
  }) {
    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId: data.webhookId,
        event: data.event,
        payload: data.payload,
        status: 'pending',
        attempt: 1,
        maxAttempts: data.maxAttempts || 3,
      },
      include: {
        webhook: true,
      },
    });

    return delivery;
  }

  /**
   * Get webhook delivery by ID
   */
  async getDeliveryById(id: string) {
    const delivery = await prisma.webhookDelivery.findUnique({
      where: { id },
      include: {
        webhook: true,
      },
    });

    if (!delivery) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Webhook delivery'), HTTP_STATUS.NOT_FOUND);
    }

    return delivery;
  }

  /**
   * Get webhook deliveries with filtering and pagination
   */
  async getDeliveries(options: GetWebhookDeliveriesOptions = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      webhookId,
      status,
      event,
    } = options;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (webhookId) where.webhookId = webhookId;
    if (status) where.status = status;
    if (event) where.event = event;

    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
        include: {
          webhook: {
            select: {
              id: true,
              name: true,
              url: true,
            },
          },
        },
      }),
      prisma.webhookDelivery.count({ where }),
    ]);

    return {
      deliveries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update webhook delivery status
   */
  async updateDeliveryStatus(
    id: string,
    data: {
      status: string;
      statusCode?: number;
      responseBody?: string;
      errorMessage?: string;
      deliveredAt?: Date;
      nextRetryAt?: Date;
    }
  ) {
    const delivery = await prisma.webhookDelivery.update({
      where: { id },
      data,
    });

    return delivery;
  }

  /**
   * Increment delivery attempt
   */
  async incrementAttempt(id: string) {
    const delivery = await this.getDeliveryById(id);

    const updatedDelivery = await prisma.webhookDelivery.update({
      where: { id },
      data: {
        attempt: delivery.attempt + 1,
      },
    });

    return updatedDelivery;
  }

  /**
   * Get webhook delivery statistics
   */
  async getDeliveryStats(webhookId?: string): Promise<WebhookDeliveryStats> {
    const where = webhookId ? { webhookId } : {};

    const [total, pending, success, failed] = await Promise.all([
      prisma.webhookDelivery.count({ where }),
      prisma.webhookDelivery.count({ where: { ...where, status: 'pending' } }),
      prisma.webhookDelivery.count({ where: { ...where, status: 'success' } }),
      prisma.webhookDelivery.count({ where: { ...where, status: 'failed' } }),
    ]);

    const successRate = total > 0 ? (success / total) * 100 : 0;

    return {
      total,
      pending,
      success,
      failed,
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  /**
   * Get recent webhook deliveries by webhook ID
   */
  async getRecentDeliveries(webhookId: string, limit = 10) {
    const deliveries = await prisma.webhookDelivery.findMany({
      where: { webhookId },
      take: limit,
      orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
    });

    return deliveries;
  }

  /**
   * Get deliveries that need retry
   */
  async getDeliveriesForRetry() {
    const now = new Date();

    const deliveries = await prisma.webhookDelivery.findMany({
      where: {
        status: 'failed',
        nextRetryAt: {
          lte: now,
        },
        attempt: {
          lt: prisma.webhookDelivery.fields.maxAttempts,
        },
      },
      include: {
        webhook: true,
      },
    });

    return deliveries;
  }

  /**
   * Delete old webhook deliveries (cleanup)
   */
  async deleteOldDeliveries(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.webhookDelivery.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}

export const webhookDeliveryService = new WebhookDeliveryService();
