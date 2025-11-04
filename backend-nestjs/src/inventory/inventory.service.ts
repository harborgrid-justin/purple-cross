import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createInventoryItem(data: any) {
    return this.prisma.inventoryItem.create({
      data,
    });
  }

  async getInventoryItemById(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Inventory item'));
    }

    return item;
  }

  async getAllInventoryItems(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    lowStock?: boolean;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      search,
      lowStock,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { sku: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
        ],
      }),
      ...(lowStock && {
        quantity: { lte: this.prisma.inventoryItem.fields.reorderPoint },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC },
      }),
      this.prisma.inventoryItem.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateInventoryItem(id: string, data: any) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Inventory item'));
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  async deleteInventoryItem(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Inventory item'));
    }

    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }
}