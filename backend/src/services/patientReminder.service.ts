import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PatientReminderService {
  async createReminder(data: {
    patientId: string;
    reminderType: string;
    reminderDate: Date;
    description: string;
    recurring?: boolean;
    frequency?: string;
  }) {
    return prisma.patientReminder.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  async getReminder(id: string) {
    return prisma.patientReminder.findUnique({
      where: { id },
    });
  }

  async listReminders(filters?: {
    patientId?: string;
    reminderType?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { patientId, reminderType, status, startDate, endDate, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (reminderType) where.reminderType = reminderType;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.reminderDate = {};
      if (startDate) where.reminderDate.gte = startDate;
      if (endDate) where.reminderDate.lte = endDate;
    }

    const [items, total] = await Promise.all([
      prisma.patientReminder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reminderDate: 'asc' },
      }),
      prisma.patientReminder.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDueReminders() {
    return prisma.patientReminder.findMany({
      where: {
        status: 'pending',
        reminderDate: {
          lte: new Date(),
        },
      },
      orderBy: { reminderDate: 'asc' },
    });
  }

  async completeReminder(id: string) {
    return prisma.patientReminder.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  async updateReminder(
    id: string,
    data: {
      reminderDate?: Date;
      description?: string;
      recurring?: boolean;
      frequency?: string;
    }
  ) {
    return prisma.patientReminder.update({
      where: { id },
      data,
    });
  }

  async deleteReminder(id: string) {
    return prisma.patientReminder.delete({
      where: { id },
    });
  }
}

export default new PatientReminderService();
