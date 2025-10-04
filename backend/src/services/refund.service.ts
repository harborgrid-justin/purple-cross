import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RefundService {
  async createRefund(data: {
    clientId: string;
    invoiceId?: string;
    paymentId?: string;
    amount: number;
    reason: string;
    refundMethod: string;
    processedBy: string;
  }) {
    const refundNumber = await this.generateRefundNumber();
    return prisma.refund.create({
      data: { ...data, refundNumber, status: 'pending' },
    });
  }

  private async generateRefundNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.refund.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } },
    });
    return `REF-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getRefund(id: string) {
    return prisma.refund.findUnique({ where: { id } });
  }

  async listRefunds(filters?: any) {
    const { clientId, status, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      prisma.refund.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.refund.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async processRefund(id: string) {
    return prisma.refund.update({
      where: { id },
      data: { status: 'processed', processedDate: new Date() },
    });
  }

  async updateRefund(id: string, data: any) {
    return prisma.refund.update({ where: { id }, data });
  }

  async deleteRefund(id: string) {
    return prisma.refund.delete({ where: { id } });
  }
}

export default new RefundService();
