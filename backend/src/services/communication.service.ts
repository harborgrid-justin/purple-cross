import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from '../constants';

export class CommunicationService {
  async createCommunication(data: Record<string, unknown>) {
    return prisma.communication.create({
      data,
      include: {
        client: true,
      },
    });
  }

  async getCommunicationById(id: string) {
    const communication = await prisma.communication.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!communication) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Communication record'), HTTP_STATUS.NOT_FOUND);
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
      prisma.communication.findMany({
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
      prisma.communication.count({ where }),
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

  async updateCommunication(id: string, data: Record<string, unknown>) {
    const communication = await prisma.communication.findUnique({ where: { id } });

    if (!communication) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Communication record'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.communication.update({
      where: { id },
      data,
      include: {
        client: true,
      },
    });
  }

  async deleteCommunication(id: string) {
    const communication = await prisma.communication.findUnique({ where: { id } });

    if (!communication) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Communication record'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.communication.delete({
      where: { id },
    });
  }
}

export default new CommunicationService();
