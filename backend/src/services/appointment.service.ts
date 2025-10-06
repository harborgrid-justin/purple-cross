import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { Prisma } from '@prisma/client';

export class AppointmentService {
  async createAppointment(data: Prisma.AppointmentCreateInput) {
    // Check for scheduling conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        veterinarianId: data.veterinarian.connect?.id,
        status: { not: 'cancelled' },
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new AppError('Time slot already booked', 409);
    }

    return prisma.appointment.create({
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });
  }

  async getAppointmentById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        client: true,
        veterinarian: true,
        reminders: true,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    return appointment;
  }

  async getAllAppointments(options: {
    page?: number;
    limit?: number;
    patientId?: string;
    clientId?: string;
    veterinarianId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const {
      page = 1,
      limit = 20,
      patientId,
      clientId,
      veterinarianId,
      status,
      startDate,
      endDate,
    } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      ...(patientId && { patientId }),
      ...(clientId && { clientId }),
      ...(veterinarianId && { veterinarianId }),
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          startTime: { gte: startDate },
          endTime: { lte: endDate },
        }),
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { id: true, name: true, species: true },
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          veterinarian: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateAppointment(id: string, data: Prisma.AppointmentUpdateInput) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    return prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });
  }

  async deleteAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Soft delete by updating status
    return prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }
}

export default new AppointmentService();
