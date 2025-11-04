import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TimeBlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createTimeBlock(data: {
    staffId: string;
    blockType: string;
    title: string;
    startTime: Date;
    endTime: Date;
    recurring?: boolean;
    recurrenceRule?: string;
    notes?: string;
  }) {
    return this.prisma.timeBlock.create({ data });
  }

  async getTimeBlock(id: string) {
    return this.prisma.timeBlock.findUnique({ where: { id } });
  }

  async listTimeBlocks(filters?: {
    staffId?: string;
    blockType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      staffId,
      blockType,
      startDate,
      endDate,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (staffId) where.staffId = staffId;
    if (blockType) where.blockType = blockType;
    if (startDate || endDate) {
      (where as any).startTime = {};
      if (startDate) (where as any).startTime.gte = startDate;
      if (endDate) (where as any).startTime.lte = endDate;
    }
    const [items, total] = await Promise.all([
      this.prisma.timeBlock.findMany({ where, skip, take: limit, orderBy: { startTime: 'asc' } }),
      this.prisma.timeBlock.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateTimeBlock(id: string, data: any) {
    return this.prisma.timeBlock.update({ where: { id }, data });
  }

  async deleteTimeBlock(id: string) {
    return this.prisma.timeBlock.delete({ where: { id } });
  }
}