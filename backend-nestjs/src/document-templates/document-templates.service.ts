import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DocumentTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createTemplate(data: { name: string; category: string; template: any; fields?: any }) {
    return this.prisma.documentTemplate.create({
      data: { ...data, status: 'active' },
    });
  }

  async getTemplate(id: string) {
    return this.prisma.documentTemplate.findUnique({ where: { id } });
  }

  async listTemplates(filters?: { category?: string; page?: number; limit?: number }) {
    const {
      category,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    const [items, total] = await Promise.all([
      this.prisma.documentTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { usageCount: 'desc' },
      }),
      this.prisma.documentTemplate.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async incrementUsage(id: string) {
    return this.prisma.documentTemplate.update({
      where: { id },
      data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
    });
  }

  async signDocument(data: {
    documentId: string;
    signerId: string;
    signerName: string;
    signerEmail: string;
    signatureData: string;
    ipAddress?: string;
  }) {
    return this.prisma.documentSignature.create({
      data: { ...data, signedAt: new Date(), status: 'signed' },
    });
  }

  async getDocumentSignatures(documentId: string) {
    return this.prisma.documentSignature.findMany({
      where: { documentId },
      orderBy: { signedAt: 'asc' },
    });
  }

  async createWorkflow(data: {
    documentId: string;
    workflowName: string;
    totalSteps: number;
    steps: any;
  }) {
    return this.prisma.documentWorkflow.create({
      data: { ...data, currentStep: 1, status: 'in_progress' },
    });
  }

  async advanceWorkflow(id: string) {
    const workflow = await this.prisma.documentWorkflow.findUnique({ where: { id } });
    if (!workflow) throw new Error('Workflow not found');

    const nextStep = workflow.currentStep + 1;
    const completed = nextStep > workflow.totalSteps;

    return this.prisma.documentWorkflow.update({
      where: { id },
      data: {
        currentStep: completed ? workflow.totalSteps : nextStep,
        status: completed ? 'completed' : 'in_progress',
        completedAt: completed ? new Date() : null,
      },
    });
  }

  async updateTemplate(id: string, data: any) {
    return this.prisma.documentTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    return this.prisma.documentTemplate.delete({ where: { id } });
  }
}