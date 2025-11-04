import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async addToWaitlist(data: {
    patientId: string;
    clientId: string;
    appointmentType: string;
    preferredDate?: Date;
    preferredTime?: string;
    priority?: number;
    urgency?: string;
    reason: string;
    notes?: string;
  }) {
    return this.prisma.waitlist.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async getWaitlistEntry(id: string) {
    return this.prisma.waitlist.findUnique({
      where: { id },
    });
  }

  async listWaitlist(filters?: {
    appointmentType?: string;
    urgency?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      appointmentType,
      urgency,
      status = 'active',
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status };
    if (appointmentType) where.appointmentType = appointmentType;
    if (urgency) where.urgency = urgency;

    const [items, total] = await Promise.all([
      this.prisma.waitlist.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      }),
      this.prisma.waitlist.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async notifyWaitlistEntry(id: string) {
    return this.prisma.waitlist.update({
      where: { id },
      data: {
        notifiedAt: new Date(),
      },
    });
  }

  async bookWaitlistEntry(id: string) {
    return this.prisma.waitlist.update({
      where: { id },
      data: {
        status: 'booked',
        bookedAt: new Date(),
      },
    });
  }

  async cancelWaitlistEntry(id: string) {
    return this.prisma.waitlist.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  async updateWaitlistEntry(id: string, data: any) {
    return this.prisma.waitlist.update({ where: { id }, data });
  }

  async deleteWaitlistEntry(id: string) {
    return this.prisma.waitlist.delete({
      where: { id },
    });
  }
}