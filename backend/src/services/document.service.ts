import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class DocumentService {
  async createDocument(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({
      data,
    });
  }

  async getDocumentById(id: string) {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    return document;
  }

  async getAllDocuments(options: {
    page?: number;
    limit?: number;
    entityType?: string;
    entityId?: string;
    category?: string;
  }) {
    const { page = 1, limit = 20, entityType, entityId, category } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(category && { category }),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    return prisma.document.update({
      where: { id },
      data,
    });
  }

  async deleteDocument(id: string) {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    return prisma.document.delete({
      where: { id },
    });
  }
}

export default new DocumentService();
