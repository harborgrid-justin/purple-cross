import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { Prisma } from '@prisma/client';

export class PrescriptionService {
  async createPrescription(data: Prisma.PrescriptionCreateInput) {
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
      throw new AppError('Prescription not found', 404);
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
    const { page = 1, limit = 20, patientId, prescribedById, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.PrescriptionWhereInput = {
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

  async updatePrescription(id: string, data: Prisma.PrescriptionUpdateInput) {
    const prescription = await prisma.prescription.findUnique({ where: { id } });

    if (!prescription) {
      throw new AppError('Prescription not found', 404);
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
      throw new AppError('Prescription not found', 404);
    }

    return prisma.prescription.delete({
      where: { id },
    });
  }
}

export default new PrescriptionService();
