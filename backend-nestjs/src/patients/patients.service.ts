import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createPatient(data: any) {
    const patient = await this.prisma.patient.create({
      data,
      include: {
        owner: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.PATIENT_CREATED, {
      patientId: patient.id,
      patient,
    });

    return patient;
  }

  async getPatientById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        owner: true,
        medicalRecords: {
          orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC },
          take: QUERY_LIMITS.MEDICAL_RECORDS,
        },
        appointments: {
          orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC },
          take: QUERY_LIMITS.APPOINTMENTS,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Patient'));
    }

    return patient;
  }

  async getAllPatients(options: {
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      ownerId,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(ownerId && { ownerId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { microchipId: { contains: search, mode: QUERY_MODE.INSENSITIVE } },
          { owner: { email: { contains: search, mode: QUERY_MODE.INSENSITIVE } } },
        ],
      }),
    };

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updatePatient(id: string, data: any) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Patient'));
    }

    const updatedPatient = await this.prisma.patient.update({
      where: { id },
      data,
      include: {
        owner: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.PATIENT_UPDATED, {
      patientId: updatedPatient.id,
      patient: updatedPatient,
      previousData: patient,
    });

    return updatedPatient;
  }

  async deletePatient(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Patient'));
    }

    // Soft delete by updating status
    const deletedPatient = await this.prisma.patient.update({
      where: { id },
      data: { status: 'inactive' },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.PATIENT_DELETED, {
      patientId: deletedPatient.id,
      patient: deletedPatient,
    });

    return deletedPatient;
  }
}