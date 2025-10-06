import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from '../constants';

export class LabTestService {
  async createLabTest(data: Record<string, unknown>) {
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
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Lab test'), HTTP_STATUS.NOT_FOUND);
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
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      patientId,
      orderedById,
      status,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
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

  async updateLabTest(id: string, data: Record<string, unknown>) {
    const labTest = await prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Lab test'), HTTP_STATUS.NOT_FOUND);
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
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Lab test'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.labTest.delete({
      where: { id },
    });
  }
}

export default new LabTestService();
