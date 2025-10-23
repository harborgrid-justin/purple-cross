import { prisma } from '../config/database';
import { PAGINATION } from '../constants';


export class TimeBlockService {
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
    return prisma.timeBlock.create({ data });
  }

  async getTimeBlock(id: string) {
    return prisma.timeBlock.findUnique({ where: { id } });
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
      prisma.timeBlock.findMany({ where, skip, take: limit, orderBy: { startTime: 'asc' } }),
      prisma.timeBlock.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateTimeBlock(id: string, data: Record<string, unknown>) {
    return prisma.timeBlock.update({ where: { id }, data });
  }

  async deleteTimeBlock(id: string) {
    return prisma.timeBlock.delete({ where: { id } });
  }
}

export default new TimeBlockService();
