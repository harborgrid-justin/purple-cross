import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MedicalRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createMedicalRecord(data: any) {
    const medicalRecord = await this.prisma.medicalRecord.create({
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.MEDICAL_RECORD_CREATED, {
      medicalRecordId: medicalRecord.id,
      medicalRecord,
    });

    return medicalRecord;
  }

  async getMedicalRecordById(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    if (!record) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Medical record'));
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
      this.prisma.medicalRecord.findMany({
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
      this.prisma.medicalRecord.count({ where }),
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

  async updateMedicalRecord(id: string, data: any) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Medical record'));
    }

    const updatedRecord = await this.prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.MEDICAL_RECORD_UPDATED, {
      medicalRecordId: updatedRecord.id,
      medicalRecord: updatedRecord,
      previousData: record,
    });

    return updatedRecord;
  }

  async deleteMedicalRecord(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Medical record'));
    }

    return this.prisma.medicalRecord.delete({
      where: { id },
    });
  }
}