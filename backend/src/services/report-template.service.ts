import { prisma } from '../config/database';
import { PAGINATION } from '../constants';

export class ReportTemplateService {
  async createTemplate(data: {
    name: string;
    description?: string;
    reportType: string;
    category: string;
    configuration: any;
    createdBy: string;
    isPublic?: boolean;
  }) {
    return prisma.reportTemplate.create({
      data: { ...data, status: 'active' },
    });
  }

  async getTemplate(id: string) {
    return prisma.reportTemplate.findUnique({ where: { id } });
  }

  async listTemplates(filters?: {
    reportType?: string;
    category?: string;
    createdBy?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      reportType,
      category,
      createdBy,
      isPublic,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (reportType) where.reportType = reportType;
    if (category) where.category = category;
    if (createdBy) where.createdBy = createdBy;
    if (isPublic !== undefined) where.isPublic = isPublic;
    const [items, total] = await Promise.all([
      prisma.reportTemplate.findMany({ where, skip, take: limit, orderBy: { usageCount: 'desc' } }),
      prisma.reportTemplate.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async incrementUsage(id: string) {
    return prisma.reportTemplate.update({
      where: { id },
      data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
    });
  }

  async scheduleReport(data: {
    reportTemplateId?: string;
    name: string;
    description?: string;
    frequency: string;
    schedule: any;
    recipients: string[];
    format?: string;
  }) {
    const nextRunAt = this.calculateNextRun(data.frequency, data.schedule);
    return prisma.reportSchedule.create({
      data: { ...data, nextRunAt, status: 'active' },
    });
  }

  private calculateNextRun(frequency: string, _schedule: any): Date {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    return now;
  }

  async updateSchedule(id: string, data: Record<string, unknown>) {
    return prisma.reportSchedule.update({ where: { id }, data });
  }

  async getScheduledReports() {
    return prisma.reportSchedule.findMany({
      where: { status: 'active', nextRunAt: { lte: new Date() } },
      orderBy: { nextRunAt: 'asc' },
    });
  }

  async updateTemplate(id: string, data: Record<string, unknown>) {
    return prisma.reportTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    return prisma.reportTemplate.delete({ where: { id } });
  }
}

export default new ReportTemplateService();
