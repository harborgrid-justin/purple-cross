import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { Prisma } from '@prisma/client';

export class LabTestService {
  async createLabTest(data: Prisma.LabTestCreateInput) {
    return prisma.labTest.create({
      data,
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async getLabTestById(id: string) {
    const labTest = await prisma.labTest.findUnique({
      where: { id },
      include: {
        patient: true,
        orderedBy: true,
      },
    });

    if (!labTest) {
      throw new AppError('Lab test not found', 404);
    }

    return labTest;
  }

  async getAllLabTests(options: {
    page?: number;
    limit?: number;
    patientId?: string;
    orderedById?: string;
    status?: string;
  }) {
    const { page = 1, limit = 20, patientId, orderedById, status } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.LabTestWhereInput = {
      ...(patientId && { patientId }),
      ...(orderedById && { orderedById }),
      ...(status && { status }),
    };

    const [labTests, total] = await Promise.all([
      prisma.labTest.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: { id: true, name: true, species: true },
          },
          orderedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { orderDate: 'desc' },
      }),
      prisma.labTest.count({ where }),
    ]);

    return {
      data: labTests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateLabTest(id: string, data: Prisma.LabTestUpdateInput) {
    const labTest = await prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new AppError('Lab test not found', 404);
    }

    return prisma.labTest.update({
      where: { id },
      data,
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async deleteLabTest(id: string) {
    const labTest = await prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new AppError('Lab test not found', 404);
    }

    return prisma.labTest.delete({
      where: { id },
    });
  }
}

export default new LabTestService();
