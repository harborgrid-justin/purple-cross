import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommunicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createCommunication(data: any) {
    return this.prisma.communication.create({
      data,
      include: {
        client: true,
      },
    });
  }

  async getCommunicationById(id: string) {
    const communication = await this.prisma.communication.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!communication) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Communication record'));
    }

    return communication;
  }

  async getAllCommunications(options: {
    page?: number;
    limit?: number;
    clientId?: string;
    type?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      clientId,
      type,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(clientId && { clientId }),
      ...(type && { type }),
    };

    const [communications, total] = await Promise.all([
      this.prisma.communication.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.communication.count({ where }),
    ]);

    return {
      data: communications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateCommunication(id: string, data: any) {
    const communication = await this.prisma.communication.findUnique({ where: { id } });

    if (!communication) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Communication record'));
    }

    return this.prisma.communication.update({
      where: { id },
      data,
      include: {
        client: true,
      },
    });
  }

  async deleteCommunication(id: string) {
    const communication = await this.prisma.communication.findUnique({ where: { id } });

    if (!communication) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Communication record'));
    }

    return this.prisma.communication.delete({
      where: { id },
    });
  }
}