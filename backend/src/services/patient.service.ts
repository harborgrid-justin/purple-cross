import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  QUERY_LIMITS,
  QUERY_MODE,
  SORT_ORDER,
  FIELDS,
  WORKFLOW_EVENTS,
} from '../constants';
import { workflowTriggerService } from './workflow-trigger.service';

export class PatientService {
  async createPatient(data: Record<string, unknown>) {
    const patient = await prisma.patient.create({
      data,
      include: {
        owner: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.PATIENT_CREATED, {
      patientId: patient.id,
      patient,
    });

    return patient;
  }

  async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
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
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
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
      prisma.patient.findMany({
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
      prisma.patient.count({ where }),
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

  async updatePatient(id: string, data: Record<string, unknown>) {
    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data,
      include: {
        owner: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.PATIENT_UPDATED, {
      patientId: updatedPatient.id,
      patient: updatedPatient,
      previousData: patient,
    });

    return updatedPatient;
  }

  async deletePatient(id: string) {
    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Patient'), HTTP_STATUS.NOT_FOUND);
    }

    // Soft delete by updating status
    const deletedPatient = await prisma.patient.update({
      where: { id },
      data: { status: 'inactive' },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.PATIENT_DELETED, {
      patientId: deletedPatient.id,
      patient: deletedPatient,
    });

    return deletedPatient;
  }
}

export default new PatientService();
