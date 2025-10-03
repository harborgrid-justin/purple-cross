import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class MedicalRecordService {
  async createMedicalRecord(data: Prisma.MedicalRecordCreateInput) {
    return prisma.medicalRecord.create({
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });
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
      throw new AppError('Medical record not found', 404);
    }

    return record;
  }

  async getAllMedicalRecords(options: {
    page?: number;
    limit?: number;
    patientId?: string;
    veterinarianId?: string;
  }) {
    const { page = 1, limit = 20, patientId, veterinarianId } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalRecordWhereInput = {
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
        orderBy: { visitDate: 'desc' },
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

  async updateMedicalRecord(id: string, data: Prisma.MedicalRecordUpdateInput) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    return prisma.medicalRecord.update({
      where: { id },
      data,
      include: {
        patient: true,
        veterinarian: true,
      },
    });
  }

  async deleteMedicalRecord(id: string) {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    return prisma.medicalRecord.delete({
      where: { id },
    });
  }
}

export default new MedicalRecordService();
