import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
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
    return this.prisma.equipment.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async getEquipment(id: string) {
    return this.prisma.equipment.findUnique({
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
      this.prisma.equipment.findMany({
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
      this.prisma.equipment.count({ where }),
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
    return this.prisma.equipment.update({
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
    return this.prisma.equipmentMaintenance.create({
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
    return this.prisma.equipmentMaintenance.update({
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
      this.prisma.equipmentMaintenance.findMany({
        where,
        skip,
        take: limit,
        include: {
          equipment: true,
        },
        orderBy: { scheduledDate: 'asc' },
      }),
      this.prisma.equipmentMaintenance.count({ where }),
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

    return this.prisma.equipmentMaintenance.findMany({
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
    return this.prisma.equipment.update({
      where: { id },
      data: {
        status: 'retired',
      },
    });
  }
}