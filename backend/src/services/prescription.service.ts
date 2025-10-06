import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from '../constants';

export class PrescriptionService {
  async createPrescription(data: Record<string, unknown>) {
    return prisma.prescription.create({
      data,
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
      },
    });
  }

  async getPrescriptionById(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        medication: true,
        prescribedBy: true,
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
          prescribedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { prescriptionDate: 'desc' },
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

  async updatePrescription(id: string, data: Record<string, unknown>) {
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
        prescribedBy: true,
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
}

export default new PrescriptionService();
