import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createClient(data: any) {
    // Check if email already exists
    const existing = await this.prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException(
        ERROR_MESSAGES.ALREADY_EXISTS('Client with this email'));
    }

    const client = await this.prisma.client.create({
      data,
      include: {
        patients: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.CLIENT_CREATED, {
      clientId: client.id,
      client,
    });

    return client;
  }

  async getClientById(id: string) {
    const client = await this.prisma.client.findUnique({
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
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Client'));
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
      this.prisma.client.findMany({
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
      this.prisma.client.count({ where }),
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
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Client'));
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data,
      include: {
        patients: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.CLIENT_UPDATED, {
      clientId: updatedClient.id,
      client: updatedClient,
      previousData: client,
    });

    return updatedClient;
  }

  async deleteClient(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Client'));
    }

    // Soft delete by updating status
    const deletedClient = await this.prisma.client.update({
      where: { id },
      data: { status: 'inactive' },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.CLIENT_DELETED, {
      clientId: deletedClient.id,
      client: deletedClient,
    });

    return deletedClient;
  }
}