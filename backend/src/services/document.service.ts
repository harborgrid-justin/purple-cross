import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from '../constants';

export class DocumentService {
  async createDocument(data: Record<string, unknown>) {
    return prisma.document.create({
      data,
    });
  }

  async getDocumentById(id: string) {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Document'), HTTP_STATUS.NOT_FOUND);
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
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      entityType,
      entityId,
      category,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
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

  async updateDocument(id: string, data: Record<string, unknown>) {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Document'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.document.update({
      where: { id },
      data,
    });
  }

  async deleteDocument(id: string) {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Document'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.document.delete({
      where: { id },
    });
  }
}

export default new DocumentService();
