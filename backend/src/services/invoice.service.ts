import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';

export class InvoiceService {
  async createInvoice(data: any) {
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
      throw new AppError('Invoice not found', 404);
    }

    return invoice;
  }

  async getAllInvoices(options: {
    page?: number;
    limit?: number;
    clientId?: string;
    status?: string;
  }) {
    const { page = 1, limit = 20, clientId, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
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
        orderBy: { invoiceDate: 'desc' },
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

  async updateInvoice(id: string, data: any) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
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
      throw new AppError('Invoice not found', 404);
    }

    return prisma.invoice.delete({
      where: { id },
    });
  }
}

export default new InvoiceService();
