import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, WORKFLOW_EVENTS } from '../constants';
import { domainEvents } from './domain-events.service';

export class PrescriptionService {
  async createPrescription(data: Prisma.PrescriptionUncheckedCreateInput) {
    const prescription = await prisma.prescription.create({
      data,
      include: {
        patient: true,
        medication: true,
        prescriber: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.PRESCRIPTION_CREATED, {
      prescriptionId: prescription.id,
      prescription,
    });

    return prescription;
  }

  async getPrescriptionById(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        medication: true,
        prescriber: true,
      },
    });

    if (!prescription) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Prescription'), HTTP_STATUS.NOT_FOUND);
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
      prisma.prescription.findMany({
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
          prescriber: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { prescribedDate: 'desc' },
      }),
      prisma.prescription.count({ where }),
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

  async updatePrescription(id: string, data: Prisma.PrescriptionUncheckedUpdateInput) {
    const prescription = await prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Prescription'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.prescription.update({
      where: { id },
      data,
      include: {
        patient: true,
        medication: true,
        prescriber: true,
      },
    });
  }

  async deletePrescription(id: string) {
    const prescription = await prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Prescription'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.prescription.delete({
      where: { id },
    });
  }

  async refillPrescription(id: string) {
    const prescription = await prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Prescription'), HTTP_STATUS.NOT_FOUND);
    }

    const refilledPrescription = await prisma.prescription.update({
      where: { id },
      data: { 
        refillsUsed: prescription.refillsUsed + 1,
      },
      include: {
        patient: true,
        medication: true,
        prescriber: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.PRESCRIPTION_REFILLED, {
      prescriptionId: refilledPrescription.id,
      prescription: refilledPrescription,
    });

    return refilledPrescription;
  }
}

export default new PrescriptionService();
