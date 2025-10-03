import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class StaffService {
  async createStaff(data: Prisma.StaffCreateInput) {
    // Check if email already exists
    const existing = await prisma.staff.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Staff with this email already exists', 400);
    }

    return prisma.staff.create({
      data,
    });
  }

  async getStaffById(id: string) {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        veterinarianAppointments: {
          take: 5,
          orderBy: { startTime: 'desc' },
        },
        schedules: {
          take: 10,
          orderBy: { shiftDate: 'desc' },
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    return staff;
  }

  async getAllStaff(options: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 20, role, status, search } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.StaffWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      prisma.staff.count({ where }),
    ]);

    return {
      data: staff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStaff(id: string, data: Prisma.StaffUpdateInput) {
    const staff = await prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    return prisma.staff.update({
      where: { id },
      data,
    });
  }

  async deleteStaff(id: string) {
    const staff = await prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    // Soft delete by updating status
    return prisma.staff.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}

export default new StaffService();
