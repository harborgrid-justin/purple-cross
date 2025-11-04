import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EstimateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createEstimate(data: {
    clientId: string;
    patientId?: string;
    title: string;
    description?: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      itemType: string;
      itemId?: string;
    }>;
    validUntil: Date;
    notes?: string;
  }) {
    const estimateNumber = await this.generateEstimateNumber();

    const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;

    return this.prisma.estimate.create({
      data: {
        estimateNumber,
        clientId: data.clientId,
        patientId: data.patientId,
        title: data.title,
        description: data.description,
        subtotal,
        tax,
        total,
        validUntil: data.validUntil,
        notes: data.notes,
        lineItems: {
          create: data.lineItems.map((item: any) => ({
            ...item,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });
  }

  private async generateEstimateNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.estimate.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });

    return `EST-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getEstimate(id: string) {
    return this.prisma.estimate.findUnique({
      where: { id },
      include: {
        lineItems: true,
      },
    });
  }

  async listEstimates(filters?: {
    clientId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      clientId,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.estimate.findMany({
        where,
        skip,
        take: limit,
        include: {
          lineItems: true,
        },
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.estimate.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveEstimate(id: string) {
    return this.prisma.estimate.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
      },
    });
  }

  async convertToInvoice(id: string) {
    const estimate = await this.getEstimate(id);
    if (!estimate) throw new Error('Estimate not found');

    // Generate invoice number
    const year = new Date().getFullYear();
    const invoiceCount = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });
    const invoiceNumber = `INV-${year}-${String(invoiceCount + 1).padStart(5, '0')}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: estimate.clientId,
        subtotal: estimate.subtotal,
        tax: estimate.tax,
        total: estimate.total,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lineItems: {
          create: estimate.lineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            itemType: item.itemType,
            itemId: item.itemId,
          })),
        },
      },
    });

    await this.prisma.estimate.update({
      where: { id },
      data: {
        status: 'converted',
        convertedToInvoiceAt: new Date(),
        invoiceId: invoice.id,
      },
    });

    return invoice;
  }

  async rejectEstimate(id: string) {
    return this.prisma.estimate.update({
      where: { id },
      data: {
        status: 'rejected',
      },
    });
  }

  async updateEstimate(id: string, data: any) {
    return this.prisma.estimate.update({ where: { id }, data });
  }

  async deleteEstimate(id: string) {
    return this.prisma.estimate.delete({
      where: { id },
    });
  }
}