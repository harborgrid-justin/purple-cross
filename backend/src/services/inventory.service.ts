import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class InventoryService {
  async createInventoryItem(data: Prisma.InventoryItemCreateInput) {
    return prisma.inventoryItem.create({
      data,
    });
  }

  async getInventoryItemById(id: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new AppError('Inventory item not found', 404);
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
    const { page = 1, limit = 20, category, search, lowStock } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryItemWhereInput = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
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
        orderBy: { name: 'asc' },
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

  async updateInventoryItem(id: string, data: Prisma.InventoryItemUpdateInput) {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    return prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  async deleteInventoryItem(id: string) {
    const item = await prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    return prisma.inventoryItem.delete({
      where: { id },
    });
  }
}

export default new InventoryService();
