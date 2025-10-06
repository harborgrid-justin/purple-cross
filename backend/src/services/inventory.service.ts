import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  QUERY_MODE,
  SORT_ORDER,
  FIELDS,
} from '../constants';

export class InventoryService {
  async createInventoryItem(data: Record<string, unknown>) {
    return prisma.inventoryItem.create({
      data,
    });
  }

  async getInventoryItemById(id: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Inventory item'), HTTP_STATUS.NOT_FOUND);
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
        quantity: { lte: prisma.inventoryItem.fields.reorderPoint },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC },
      }),
      prisma.inventoryItem.count({ where }),
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

  async updateInventoryItem(id: string, data: Record<string, unknown>) {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Inventory item'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  async deleteInventoryItem(id: string) {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Inventory item'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.inventoryItem.delete({
      where: { id },
    });
  }
}

export default new InventoryService();
