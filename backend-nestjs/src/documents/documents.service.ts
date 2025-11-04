import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createDocument(data: any) {
    return this.prisma.document.create({
      data,
    });
  }

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Document'));
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
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
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

  async updateDocument(id: string, data: any) {
    const document = await this.prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Document'));
    }

    return this.prisma.document.update({
      where: { id },
      data,
    });
  }

  async deleteDocument(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Document'));
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}