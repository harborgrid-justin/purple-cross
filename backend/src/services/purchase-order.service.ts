import { prisma } from '../config/database';
import { PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS } from '../constants';

export class PurchaseOrderService {
  async createPurchaseOrder(data: {
    vendor: string;
    vendorContact?: string;
    expectedDate?: Date;
    lineItems: Array<{
      itemType: string;
      itemId?: string;
      description: string;
      quantityOrdered: number;
      unitCost: number;
    }>;
    notes?: string;
  }) {
    const poNumber = await this.generatePONumber();

    const subtotal = data.lineItems.reduce(
      (sum, item) => sum + item.quantityOrdered * item.unitCost,
      0
    );

    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = 0;
    const total = subtotal + tax + shipping;

    return prisma.purchaseOrder.create({
      data: {
        poNumber,
        vendor: data.vendor,
        vendorContact: data.vendorContact,
        expectedDate: data.expectedDate,
        subtotal,
        tax,
        shipping,
        total,
        notes: data.notes,
        lineItems: {
          create: data.lineItems.map((item: any) => ({
            ...item,
            total: item.quantityOrdered * item.unitCost,
            status: 'pending',
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });
  }

  private async generatePONumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });

    return `PO-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getPurchaseOrder(id: string) {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        lineItems: true,
      },
    });
  }

  async listPurchaseOrders(filters?: {
    status?: string;
    vendor?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      status,
      vendor,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (vendor) where.vendor = { contains: vendor, mode: QUERY_MODE.INSENSITIVE };

    const [items, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          lineItems: true,
        },
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approvePurchaseOrder(id: string, approvedBy: string) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }

  async receiveItems(
    id: string,
    itemReceipts: Array<{
      itemId: string;
      quantityReceived: number;
    }>
  ) {
    const po = await this.getPurchaseOrder(id);
    if (!po) throw new Error('Purchase order not found');

    for (const receipt of itemReceipts) {
      await prisma.purchaseOrderItem.update({
        where: { id: receipt.itemId },
        data: {
          quantityReceived: { increment: receipt.quantityReceived },
        },
      });
    }

    const allItems = await prisma.purchaseOrderItem.findMany({
      where: { purchaseOrderId: id },
    });

    const allReceived = allItems.every(
      (item: any) => item.quantityReceived >= item.quantityOrdered
    );

    if (allReceived) {
      await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'received',
          receivedDate: new Date(),
        },
      });
    }

    return this.getPurchaseOrder(id);
  }

  async cancelPurchaseOrder(id: string) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  async updatePurchaseOrder(id: string, data: Record<string, unknown>) {
    return prisma.purchaseOrder.update({ where: { id }, data });
  }

  async deletePurchaseOrder(id: string) {
    return prisma.purchaseOrder.delete({
      where: { id },
    });
  }
}

export default new PurchaseOrderService();
