import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentTemplateService {
  async createTemplate(data: {
    name: string;
    category: string;
    template: any;
    fields?: any;
  }) {
    return prisma.documentTemplate.create({
      data: { ...data, status: 'active' },
    });
  }

  async getTemplate(id: string) {
    return prisma.documentTemplate.findUnique({ where: { id } });
  }

  async listTemplates(filters?: { category?: string; page?: number; limit?: number }) {
    const { category, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (category) where.category = category;
    const [items, total] = await Promise.all([
      prisma.documentTemplate.findMany({ where, skip, take: limit, orderBy: { usageCount: 'desc' } }),
      prisma.documentTemplate.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async incrementUsage(id: string) {
    return prisma.documentTemplate.update({
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
    return prisma.documentSignature.create({
      data: { ...data, signedAt: new Date(), status: 'signed' },
    });
  }

  async getDocumentSignatures(documentId: string) {
    return prisma.documentSignature.findMany({
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
    return prisma.documentWorkflow.create({
      data: { ...data, currentStep: 1, status: 'in_progress' },
    });
  }

  async advanceWorkflow(id: string) {
    const workflow = await prisma.documentWorkflow.findUnique({ where: { id } });
    if (!workflow) throw new Error('Workflow not found');
    
    const nextStep = workflow.currentStep + 1;
    const completed = nextStep > workflow.totalSteps;
    
    return prisma.documentWorkflow.update({
      where: { id },
      data: {
        currentStep: completed ? workflow.totalSteps : nextStep,
        status: completed ? 'completed' : 'in_progress',
        completedAt: completed ? new Date() : null,
      },
    });
  }
}

export default new DocumentTemplateService();
