import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createInvoice(data: any) {
    const invoice = await this.prisma.invoice.create({
      data,
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.INVOICE_CREATED, {
      invoiceId: invoice.id,
      invoice,
    });

    return invoice;
  }

  async getInvoiceById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Invoice'));
    }

    return invoice;
  }

  async getAllInvoices(options: {
    page?: number;
    limit?: number;
    clientId?: string;
    status?: string;
  }) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      clientId,
      status,
    } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      ...(clientId && { clientId }),
      ...(status && { status }),
    };

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          lineItems: true,
          payments: true,
        },
        orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateInvoice(id: string, data: any) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Invoice'));
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });
  }

  async deleteInvoice(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Invoice'));
    }

    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async markInvoiceAsPaid(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Invoice'));
    }

    const paidInvoice = await this.prisma.invoice.update({
      where: { id },
      data: { status: 'paid' },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.INVOICE_PAID, {
      invoiceId: paidInvoice.id,
      invoice: paidInvoice,
    });

    return paidInvoice;
  }

  async markInvoiceAsOverdue(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Invoice'));
    }

    const overdueInvoice = await this.prisma.invoice.update({
      where: { id },
      data: { status: 'overdue' },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Emit domain event (triggers both webhooks and workflows)
    this.eventEmitter.emit(WORKFLOW_EVENTS.INVOICE_OVERDUE, {
      invoiceId: overdueInvoice.id,
      invoice: overdueInvoice,
    });

    return overdueInvoice;
  }
}