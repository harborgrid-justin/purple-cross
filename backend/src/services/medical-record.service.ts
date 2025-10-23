import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS, WORKFLOW_EVENTS } from '../constants';
import { workflowTriggerService } from './workflow-trigger.service';

export class MedicalRecordService {
  async createMedicalRecord(data: Record<string, unknown>) {
    const medicalRecord = await prisma.medicalRecord.create({
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.MEDICAL_RECORD_CREATED, {
      medicalRecordId: medicalRecord.id,
      medicalRecord,
    });

    return medicalRecord;
  }

  async getMedicalRecordById(id: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    if (!record) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Medical record'), HTTP_STATUS.NOT_FOUND);
    }

    return record;
  }

  async getAllMedicalRecords(options: {
    page?: number;
    limit?: number;
    patientId?: string;
    veterinarianId?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      patientId,
      veterinarianId,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(patientId && { patientId }),
      ...(veterinarianId && { veterinarianId }),
    };

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { id: true, name: true, species: true },
          },
          veterinarian: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC },
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    return {
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateMedicalRecord(id: string, data: Record<string, unknown>) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Medical record'), HTTP_STATUS.NOT_FOUND);
    }

    const updatedRecord = await prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.MEDICAL_RECORD_UPDATED, {
      medicalRecordId: updatedRecord.id,
      medicalRecord: updatedRecord,
      previousData: record,
    });

    return updatedRecord;
  }

  async deleteMedicalRecord(id: string) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Medical record'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.medicalRecord.delete({
      where: { id },
    });
  }
}

export default new MedicalRecordService();
