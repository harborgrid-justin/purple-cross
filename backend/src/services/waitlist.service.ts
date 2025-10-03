import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WaitlistService {
  async addToWaitlist(data: {
    patientId: string;
    clientId: string;
    appointmentType: string;
    preferredDate?: Date;
    preferredTime?: string;
    priority?: number;
    urgency?: string;
    reason: string;
    notes?: string;
  }) {
    return prisma.waitlist.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  async getWaitlistEntry(id: string) {
    return prisma.waitlist.findUnique({
      where: { id },
    });
  }

  async listWaitlist(filters?: {
    appointmentType?: string;
    urgency?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { appointmentType, urgency, status = 'active', page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = { status };
    if (appointmentType) where.appointmentType = appointmentType;
    if (urgency) where.urgency = urgency;

    const [items, total] = await Promise.all([
      prisma.waitlist.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' },
        ],
      }),
      prisma.waitlist.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async notifyWaitlistEntry(id: string) {
    return prisma.waitlist.update({
      where: { id },
      data: {
        notifiedAt: new Date(),
      },
    });
  }

  async bookWaitlistEntry(id: string) {
    return prisma.waitlist.update({
      where: { id },
      data: {
        status: 'booked',
        bookedAt: new Date(),
      },
    });
  }

  async cancelWaitlistEntry(id: string) {
    return prisma.waitlist.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  async deleteWaitlistEntry(id: string) {
    return prisma.waitlist.delete({
      where: { id },
    });
  }
}

export default new WaitlistService();
