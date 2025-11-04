import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RefundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createRefund(data: {
    clientId: string;
    invoiceId?: string;
    paymentId?: string;
    amount: number;
    reason: string;
    refundMethod: string;
    processedBy: string;
  }) {
    const refundNumber = await this.generateRefundNumber();
    return this.prisma.refund.create({
      data: { ...data, refundNumber, status: 'pending' },
    });
  }

  private async generateRefundNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.refund.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } },
    });
    return `REF-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getRefund(id: string) {
    return this.prisma.refund.findUnique({ where: { id } });
  }

  async listRefunds(filters?: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtersAny = (filters as any) || {};
    const {
      clientId,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filtersAny;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      this.prisma.refund.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.refund.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async processRefund(id: string) {
    return this.prisma.refund.update({
      where: { id },
      data: { status: 'processed', processedDate: new Date() },
    });
  }

  async updateRefund(id: string, data: any) {
    return this.prisma.refund.update({ where: { id }, data });
  }

  async deleteRefund(id: string) {
    return this.prisma.refund.delete({ where: { id } });
  }
}