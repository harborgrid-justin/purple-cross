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

export class StaffService {
  async createStaff(data: Record<string, unknown>) {
    // Check if email already exists
    const existing = await prisma.staff.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError(
        ERROR_MESSAGES.ALREADY_EXISTS('Staff with this email'),
        HTTP_STATUS.BAD_REQUEST
      );
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
          take: QUERY_LIMITS.APPOINTMENTS,
          orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC },
        },
        schedules: {
          take: QUERY_LIMITS.RECENT_ITEMS,
          orderBy: { shiftDate: 'desc' },
        },
      },
    });

    if (!staff) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Staff member'), HTTP_STATUS.NOT_FOUND);
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
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      role,
      status,
      search,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { lastName: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { email: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
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

  async updateStaff(id: string, data: Record<string, unknown>) {
    const staff = await prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Staff member'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.staff.update({
      where: { id },
      data,
    });
  }

  async deleteStaff(id: string) {
    const staff = await prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Staff member'), HTTP_STATUS.NOT_FOUND);
    }

    // Soft delete by updating status
    return prisma.staff.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}

export default new StaffService();
