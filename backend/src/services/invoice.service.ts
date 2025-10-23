import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS, WORKFLOW_EVENTS } from '../constants';
import { workflowTriggerService } from './workflow-trigger.service';

export class InvoiceService {
  async createInvoice(data: Record<string, unknown>) {
    const invoice = await prisma.invoice.create({
      data,
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.INVOICE_CREATED, {
      invoiceId: invoice.id,
      invoice,
    });

    return invoice;
  }

  async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Invoice'), HTTP_STATUS.NOT_FOUND);
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
      prisma.invoice.findMany({
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
      prisma.invoice.count({ where }),
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

  async updateInvoice(id: string, data: Record<string, unknown>) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Invoice'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.invoice.update({
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
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Invoice'), HTTP_STATUS.NOT_FOUND);
    }

    return prisma.invoice.delete({
      where: { id },
    });
  }

  async markInvoiceAsPaid(id: string) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Invoice'), HTTP_STATUS.NOT_FOUND);
    }

    const paidInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'paid' },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.INVOICE_PAID, {
      invoiceId: paidInvoice.id,
      invoice: paidInvoice,
    });

    return paidInvoice;
  }

  async markInvoiceAsOverdue(id: string) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Invoice'), HTTP_STATUS.NOT_FOUND);
    }

    const overdueInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'overdue' },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    // Trigger workflow event
    workflowTriggerService.emitWorkflowEvent(WORKFLOW_EVENTS.INVOICE_OVERDUE, {
      invoiceId: overdueInvoice.id,
      invoice: overdueInvoice,
    });

    return overdueInvoice;
  }
}

export default new InvoiceService();
