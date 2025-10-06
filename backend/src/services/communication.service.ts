import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { Prisma } from '@prisma/client';

export class CommunicationService {
  async createCommunication(data: Prisma.CommunicationCreateInput) {
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
      throw new AppError('Communication record not found', 404);
    }

    return communication;
  }

  async getAllCommunications(options: {
    page?: number;
    limit?: number;
    clientId?: string;
    type?: string;
  }) {
    const { page = 1, limit = 20, clientId, type } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.CommunicationWhereInput = {
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

  async updateCommunication(id: string, data: Prisma.CommunicationUpdateInput) {
    const communication = await prisma.communication.findUnique({ where: { id } });

    if (!communication) {
      throw new AppError('Communication record not found', 404);
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
      throw new AppError('Communication record not found', 404);
    }

    return prisma.communication.delete({
      where: { id },
    });
  }
}

export default new CommunicationService();
