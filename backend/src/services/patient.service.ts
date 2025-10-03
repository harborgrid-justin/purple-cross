import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class PatientService {
  async createPatient(data: Prisma.PatientCreateInput) {
    return prisma.patient.create({
      data,
      include: {
        owner: true,
      },
    });
  }

  async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        owner: true,
        medicalRecords: {
          orderBy: { visitDate: 'desc' },
          take: 10,
        },
        appointments: {
          orderBy: { startTime: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }

  async getAllPatients(options: {
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
  }) {
    const { page = 1, limit = 20, search, ownerId } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = {
      ...(ownerId && { ownerId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { microchipId: { contains: search, mode: 'insensitive' } },
          { owner: { email: { contains: search, mode: 'insensitive' } } },
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
        orderBy: { createdAt: 'desc' },
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

  async updatePatient(id: string, data: Prisma.PatientUpdateInput) {
    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return prisma.patient.update({
      where: { id },
      data,
      include: {
        owner: true,
      },
    });
  }

  async deletePatient(id: string) {
    const patient = await prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Soft delete by updating status
    return prisma.patient.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}

export default new PatientService();
