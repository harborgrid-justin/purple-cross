import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';

export class ClientService {
  async createClient(data: any) {
    // Check if email already exists
    const existing = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Client with this email already exists', 400);
    }

    return prisma.client.create({
      data,
      include: {
        patients: true,
      },
    });
  }

  async getClientById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        patients: {
          orderBy: { name: 'asc' },
        },
        appointments: {
          orderBy: { startTime: 'desc' },
          take: 10,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    return client;
  }

  async getAllClients(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const { page = 1, limit = 20, search, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          patients: {
            select: {
              id: true,
              name: true,
              species: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateClient(id: string, data: any) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    return prisma.client.update({
      where: { id },
      data,
      include: {
        patients: true,
      },
    });
  }

  async deleteClient(id: string) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new AppError('Client not found', 404);
    }

    // Soft delete by updating status
    return prisma.client.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}

export default new ClientService();
