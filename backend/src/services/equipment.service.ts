import { prisma } from '../config/database';
import { PAGINATION, SORT_ORDER, FIELDS, QUERY_LIMITS } from '../constants';

export class EquipmentService {
  async createEquipment(data: {
    name: string;
    category: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    warrantyExpiration?: Date;
    location?: string;
  }) {
    return prisma.equipment.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async getEquipment(id: string) {
    return prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceRecords: {
          orderBy: { scheduledDate: 'desc' },
          take: QUERY_LIMITS.RECENT_ITEMS,
        },
      },
    });
  }

  async listEquipment(filters?: {
    category?: string;
    status?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      status,
      location,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (location) where.location = location;

    const [items, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take: limit,
        include: {
          maintenanceRecords: {
            where: { status: 'scheduled' },
            orderBy: { scheduledDate: 'asc' },
            take: 1,
          },
        },
        orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC },
      }),
      prisma.equipment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateEquipment(
    id: string,
    data: {
      name?: string;
      category?: string;
      manufacturer?: string;
      modelNumber?: string;
      purchaseDate?: Date;
      purchasePrice?: number;
      warrantyExpiration?: Date;
      location?: string;
      status?: string;
    }
  ) {
    return prisma.equipment.update({
      where: { id },
      data,
    });
  }

  async scheduleMaintenance(data: {
    equipmentId: string;
    maintenanceType: string;
    scheduledDate: Date;
    performedBy?: string;
    vendor?: string;
    notes?: string;
  }) {
    return prisma.equipmentMaintenance.create({
      data: {
        ...data,
        status: 'scheduled',
      },
    });
  }

  async completeMaintenance(
    id: string,
    data: {
      completedDate: Date;
      performedBy: string;
      cost?: number;
      notes?: string;
      nextMaintenanceDate?: Date;
    }
  ) {
    return prisma.equipmentMaintenance.update({
      where: { id },
      data: {
        ...data,
        status: 'completed',
      },
    });
  }

  async getMaintenanceSchedule(filters?: {
    equipmentId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      equipmentId,
      status,
      startDate,
      endDate,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (equipmentId) where.equipmentId = equipmentId;
    if (status) where.status = status;
    if (startDate || endDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (where as any).scheduledDate = {};
      if (startDate) (where as any).scheduledDate.gte = startDate;
      if (endDate) (where as any).scheduledDate.lte = endDate;
    }

    const [items, total] = await Promise.all([
      prisma.equipmentMaintenance.findMany({
        where,
        skip,
        take: limit,
        include: {
          equipment: true,
        },
        orderBy: { scheduledDate: 'asc' },
      }),
      prisma.equipmentMaintenance.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUpcomingMaintenance(daysAhead = 30) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    return prisma.equipmentMaintenance.findMany({
      where: {
        status: 'scheduled',
        scheduledDate: {
          gte: new Date(),
          lte: endDate,
        },
      },
      include: {
        equipment: true,
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async deleteEquipment(id: string) {
    return prisma.equipment.update({
      where: { id },
      data: {
        status: 'retired',
      },
    });
  }
}

export default new EquipmentService();
