import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrescriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createPrescription(data: any) {
    const prescription = await this.prisma.prescription.create({
      data,
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.PRESCRIPTION_CREATED, {
      prescriptionId: prescription.id,
      prescription,
    });

    return prescription;
  }

  async getPrescriptionById(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Prescription'));
    }

    return prescription;
  }

  async getAllPrescriptions(options: {
    page?: number;
    limit?: number;
    patientId?: string;
    prescribedById?: string;
    status?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      patientId,
      prescribedById,
      status,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(patientId && { patientId }),
      ...(prescribedById && { prescribedById }),
      ...(status && { status }),
    };

    const [prescriptions, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { id: true, name: true, species: true },
          },
          medication: {
            select: { id: true, name: true, strength: true },
          },
          prescribedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { prescriptionDate: 'desc' },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      data: prescriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updatePrescription(id: string, data: any) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Prescription'));
    }

    return this.prisma.prescription.update({
      where: { id },
      data,
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
      },
    });
  }

  async deletePrescription(id: string) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Prescription'));
    }

    return this.prisma.prescription.delete({
      where: { id },
    });
  }

  async refillPrescription(id: string) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Prescription'));
    }

    const refilledPrescription = await this.prisma.prescription.update({
      where: { id },
      data: { 
        refills: (prescription.refills as number) + 1,
      },
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.PRESCRIPTION_REFILLED, {
      prescriptionId: refilledPrescription.id,
      prescription: refilledPrescription,
    });

    return refilledPrescription;
  }
}