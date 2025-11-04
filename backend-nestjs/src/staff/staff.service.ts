import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createStaff(data: any) {
    // Check if email already exists
    const existing = await this.prisma.staff.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException(
        ERROR_MESSAGES.ALREADY_EXISTS('Staff with this email'));
    }

    return this.prisma.staff.create({
      data,
    });
  }

  async getStaffById(id: string) {
    const staff = await this.prisma.staff.findUnique({
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
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Staff member'));
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
      this.prisma.staff.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      this.prisma.staff.count({ where }),
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

  async updateStaff(id: string, data: any) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Staff member'));
    }

    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  async deleteStaff(id: string) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Staff member'));
    }

    // Soft delete by updating status
    return this.prisma.staff.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}