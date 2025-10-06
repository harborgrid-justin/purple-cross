import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  QUERY_MODE,
  SORT_ORDER,
  FIELDS,
  QUERY_LIMITS,
} from '../constants';

export class ClientService {
  async createClient(data: Record<string, unknown>) {
    // Check if email already exists
    const existing = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError(
        ERROR_MESSAGES.ALREADY_EXISTS('Client with this email'),
        HTTP_STATUS.BAD_REQUEST
      );
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
          orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC },
        },
        appointments: {
          orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC },
          take: QUERY_LIMITS.RECENT_ITEMS,
        },
        invoices: {
          orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
          take: QUERY_LIMITS.INVOICES,
        },
      },
    });

    if (!client) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Client'), HTTP_STATUS.NOT_FOUND);
    }

    return client;
  }

  async getAllClients(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      status,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { lastName: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { email: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { phone: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
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
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
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

  async updateClient(id: string, data: Record<string, unknown>) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Client'), HTTP_STATUS.NOT_FOUND);
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
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Client'), HTTP_STATUS.NOT_FOUND);
    }

    // Soft delete by updating status
    return prisma.client.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}

export default new ClientService();
