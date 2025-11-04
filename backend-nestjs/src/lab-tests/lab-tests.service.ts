import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LabTestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createLabTest(data: any) {
    const labTest = await this.prisma.labTest.create({
      data,
      include: {
        patient: true,
        orderedBy: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.LAB_TEST_ORDERED, {
      labTestId: labTest.id,
      labTest,
    });

    return labTest;
  }

  async getLabTestById(id: string) {
    const labTest = await this.prisma.labTest.findUnique({
      where: { id },
      include: {
        patient: true,
        orderedBy: true,
      },
    });

    if (!labTest) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lab test'));
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
      this.prisma.labTest.findMany({
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
      this.prisma.labTest.count({ where }),
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

  async updateLabTest(id: string, data: any) {
    const labTest = await this.prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lab test'));
    }

    return this.prisma.labTest.update({
      where: { id },
      data,
      include: {
        patient: true,
        orderedBy: true,
      },
    });
  }

  async deleteLabTest(id: string) {
    const labTest = await this.prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lab test'));
    }

    return this.prisma.labTest.delete({
      where: { id },
    });
  }

  async completeLabTest(id: string, results: string) {
    const labTest = await this.prisma.labTest.findUnique({ where: { id } });

    if (!labTest) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Lab test'));
    }

    const completedLabTest = await this.prisma.labTest.update({
      where: { id },
      data: { 
        status: 'completed',
        results,
        resultDate: new Date(),
      },
      include: {
        patient: true,
        orderedBy: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.LAB_TEST_COMPLETED, {
      labTestId: completedLabTest.id,
      labTest: completedLabTest,
    });

    return completedLabTest;
  }
}