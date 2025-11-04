import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PolicyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createPolicy(data: {
    title: string;
    category: string;
    content: string;
    version: string;
    effectiveDate: Date;
    reviewDate?: Date;
  }) {
    return this.prisma.policy.create({
      data: { ...data, status: 'active' },
    });
  }

  async getPolicy(id: string) {
    return this.prisma.policy.findUnique({
      where: { id },
      include: {
        acknowledgments: { orderBy: { acknowledgedAt: 'desc' }, take: QUERY_LIMITS.RECENT_ITEMS },
      },
    });
  }

  async listPolicies(filters?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      this.prisma.policy.findMany({ where, skip, take: limit, orderBy: { effectiveDate: 'desc' } }),
      this.prisma.policy.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async acknowledgePolicy(policyId: string, userId: string, ipAddress?: string) {
    return this.prisma.policyAcknowledgment.create({
      data: { policyId, userId, ipAddress },
    });
  }

  async getUserAcknowledgments(userId: string) {
    return this.prisma.policyAcknowledgment.findMany({
      where: { userId },
      include: { policy: true },
      orderBy: { acknowledgedAt: 'desc' },
    });
  }

  async updatePolicy(id: string, data: any) {
    return this.prisma.policy.update({ where: { id }, data });
  }

  async deletePolicy(id: string) {
    return this.prisma.policy.delete({ where: { id } });
  }
}