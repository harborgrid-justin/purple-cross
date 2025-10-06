import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER, FIELDS } from '../constants';

export class InvoiceService {
  async createInvoice(data: Record<string, unknown>) {
    return prisma.invoice.create({
      data,
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });
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
}

export default new InvoiceService();
