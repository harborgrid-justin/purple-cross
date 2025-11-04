import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PatientReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createReminder(data: {
    patientId: string;
    reminderType: string;
    reminderDate: Date;
    description: string;
    recurring?: boolean;
    frequency?: string;
  }) {
    return this.prisma.patientReminder.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  async getReminder(id: string) {
    return this.prisma.patientReminder.findUnique({
      where: { id },
    });
  }

  async listReminders(filters?: {
    patientId?: string;
    reminderType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      patientId,
      reminderType,
      status,
      startDate,
      endDate,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (patientId) where.patientId = patientId;
    if (reminderType) where.reminderType = reminderType;
    if (status) where.status = status;
    if (startDate || endDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (where as any).reminderDate = {};
      if (startDate) (where as any).reminderDate.gte = startDate;
      if (endDate) (where as any).reminderDate.lte = endDate;
    }

    const [items, total] = await Promise.all([
      this.prisma.patientReminder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reminderDate: 'asc' },
      }),
      this.prisma.patientReminder.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDueReminders() {
    return this.prisma.patientReminder.findMany({
      where: {
        status: 'pending',
        reminderDate: {
          lte: new Date(),
        },
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  async completeReminder(id: string) {
    return this.prisma.patientReminder.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  async updateReminder(
    id: string,
    data: {
      reminderDate?: Date;
      description?: string;
      recurring?: boolean;
      frequency?: string;
    }
  ) {
    return this.prisma.patientReminder.update({
      where: { id },
      data,
    });
  }

  async deleteReminder(id: string) {
    return this.prisma.patientReminder.delete({
      where: { id },
    });
  }
}