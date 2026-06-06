import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, WORKFLOW_EVENTS } from '../constants';
import { domainEvents } from './domain-events.service';

export class LabTestService {
  async createLabTest(data: Record<string, unknown>) {
    const labTest = await prisma.labTest.create({
      data: data as Prisma.LabTestCreateInput,
      include: {
        patient: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.LAB_TEST_ORDERED, {
      labTestId: labTest.id,
      labTest,
    });

    return labTest;
  }

  async getLabTestById(id: string) {
    const labTest = await prisma.labTest.findUnique({
      where: { id },
      include: {
        patient: true,
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
      ...(orderedById && { orderedBy: orderedById }),
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
        },
        orderBy: { orderedDate: 'desc' },
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
      data: data as Prisma.LabTestUpdateInput,
      include: {
        patient: true,
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

  async completeLabTest(id: string, results: string) {
    const labTest = await prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Lab test'), HTTP_STATUS.NOT_FOUND);
    }

    const completedLabTest = await prisma.labTest.update({
      where: { id },
      data: {
        status: 'completed',
        results,
        completedDate: new Date(),
      },
      include: {
        patient: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    domainEvents.emit(WORKFLOW_EVENTS.LAB_TEST_COMPLETED, {
      labTestId: completedLabTest.id,
      labTest: completedLabTest,
    });

    return completedLabTest;
  }
}

export default new LabTestService();
