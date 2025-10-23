import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, STATUS, WORKFLOW_EVENTS } from '../constants';
import { domainEvents } from './domain-events.service';

export class AppointmentService {
  async createAppointment(data: Record<string, unknown>) {
    // Check for scheduling conflicts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataAny = data as any;
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        veterinarianId: dataAny.veterinarian.connect?.id,
        status: { not: STATUS.CANCELLED },
        OR: [
          {
            AND: [
              { startTime: { lte: dataAny.startTime } },
              { endTime: { gt: dataAny.startTime } },
            ],
          },
          {
            AND: [{ startTime: { lt: dataAny.endTime } }, { endTime: { gte: dataAny.endTime } }],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new AppError(ERROR_MESSAGES.TIME_SLOT_BOOKED, HTTP_STATUS.CONFLICT);
    }

    const appointment = await prisma.appointment.create({
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.APPOINTMENT_CREATED, {
      appointmentId: appointment.id,
      appointment,
    });

    return appointment;
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
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Appointment'), HTTP_STATUS.NOT_FOUND);
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
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      patientId,
      clientId,
      veterinarianId,
      status,
      startDate,
      endDate,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
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

  async updateAppointment(id: string, data: Record<string, unknown>) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Appointment'), HTTP_STATUS.NOT_FOUND);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.APPOINTMENT_UPDATED, {
      appointmentId: updatedAppointment.id,
      appointment: updatedAppointment,
      previousData: appointment,
    });

    return updatedAppointment;
  }

  async deleteAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Appointment'), HTTP_STATUS.NOT_FOUND);
    }

    // Soft delete by updating status
    const cancelledAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.APPOINTMENT_CANCELLED, {
      appointmentId: cancelledAppointment.id,
      appointment: cancelledAppointment,
    });

    return cancelledAppointment;
  }

  async completeAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Appointment'), HTTP_STATUS.NOT_FOUND);
    }

    const completedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'completed' },
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.APPOINTMENT_COMPLETED, {
      appointmentId: completedAppointment.id,
      appointment: completedAppointment,
    });

    return completedAppointment;
  }
}

export default new AppointmentService();
