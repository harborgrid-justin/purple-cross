import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS, STATUS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createAppointment(data: any) {
    // Check for scheduling conflicts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataAny = data as any;
    const conflictingAppointment = await this.prisma.appointment.findFirst({
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
      throw new BadRequestException(ERROR_MESSAGES.TIME_SLOT_BOOKED);
    }

    const appointment = await this.prisma.appointment.create({
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.APPOINTMENT_CREATED, {
      appointmentId: appointment.id,
      appointment,
    });

    return appointment;
  }

  async getAppointmentById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        client: true,
        veterinarian: true,
        reminders: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Appointment'));
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
      this.prisma.appointment.findMany({
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
      this.prisma.appointment.count({ where }),
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

  async updateAppointment(id: string, data: any) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Appointment'));
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.APPOINTMENT_UPDATED, {
      appointmentId: updatedAppointment.id,
      appointment: updatedAppointment,
      previousData: appointment,
    });

    return updatedAppointment;
  }

  async deleteAppointment(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Appointment'));
    }

    // Soft delete by updating status
    const cancelledAppointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.APPOINTMENT_CANCELLED, {
      appointmentId: cancelledAppointment.id,
      appointment: cancelledAppointment,
    });

    return cancelledAppointment;
  }

  async completeAppointment(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Appointment'));
    }

    const completedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'completed' },
      include: {
        patient: true,
        client: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.APPOINTMENT_COMPLETED, {
      appointmentId: completedAppointment.id,
      appointment: completedAppointment,
    });

    return completedAppointment;
  }
}