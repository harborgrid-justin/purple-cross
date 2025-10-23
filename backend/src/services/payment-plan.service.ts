import { prisma } from '../config/database';
import { PAGINATION, SORT_ORDER, FIELDS } from '../constants';

export class PaymentPlanService {
  async createPaymentPlan(data: {
    clientId: string;
    invoiceId?: string;
    totalAmount: number;
    downPayment?: number;
    installmentAmount: number;
    installmentFrequency: string;
    numberOfInstallments: number;
    interestRate?: number;
    startDate: Date;
  }) {
    const downPayment = data.downPayment || 0;
    const remainingBalance = data.totalAmount - downPayment;
    const nextPaymentDate = this.calculateNextPaymentDate(
      data.startDate,
      data.installmentFrequency
    );

    const paymentPlan = await prisma.paymentPlan.create({
      data: {
        clientId: data.clientId,
        invoiceId: data.invoiceId,
        totalAmount: data.totalAmount,
        downPayment,
        remainingBalance,
        installmentAmount: data.installmentAmount,
        installmentFrequency: data.installmentFrequency,
        numberOfInstallments: data.numberOfInstallments,
        interestRate: data.interestRate || 0,
        startDate: data.startDate,
        nextPaymentDate,
      },
    });

    // Create installments
    const installments = [];
    let currentDate = data.startDate;

    for (let i = 1; i <= data.numberOfInstallments; i++) {
      currentDate = this.calculateNextPaymentDate(
        i === 1 ? data.startDate : currentDate,
        data.installmentFrequency
      );

      installments.push({
        paymentPlanId: paymentPlan.id,
        installmentNumber: i,
        dueDate: currentDate,
        amount: data.installmentAmount,
      });
    }

    await prisma.paymentPlanInstallment.createMany({
      data: installments,
    });

    return this.getPaymentPlan(paymentPlan.id);
  }

  private calculateNextPaymentDate(currentDate: Date, frequency: string): Date {
    const date = new Date(currentDate);

    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date;
  }

  async getPaymentPlan(id: string) {
    return prisma.paymentPlan.findUnique({
      where: { id },
      include: {
        installments: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });
  }

  async listPaymentPlans(filters?: {
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
      prisma.paymentPlan.findMany({
        where,
        skip,
        take: limit,
        include: {
          installments: true,
        },
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      prisma.paymentPlan.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async recordPayment(installmentId: string, amount: number) {
    const installment = await prisma.paymentPlanInstallment.findUnique({
      where: { id: installmentId },
      include: { paymentPlan: true },
    });

    if (!installment) throw new Error('Installment not found');

    const newPaidAmount = installment.paidAmount + amount;
    const isPaid = newPaidAmount >= installment.amount;

    await prisma.paymentPlanInstallment.update({
      where: { id: installmentId },
      data: {
        paidAmount: newPaidAmount,
        paidDate: isPaid ? new Date() : installment.paidDate,
        status: isPaid ? 'paid' : 'partial',
      },
    });

    // Update payment plan balance
    const newBalance = installment.paymentPlan.remainingBalance - amount;
    await prisma.paymentPlan.update({
      where: { id: installment.paymentPlanId },
      data: {
        remainingBalance: newBalance,
      },
    });

    // Check if plan is completed
    if (newBalance <= 0) {
      await prisma.paymentPlan.update({
        where: { id: installment.paymentPlanId },
        data: {
          status: 'completed',
        },
      });
    }

    return this.getPaymentPlan(installment.paymentPlanId);
  }

  async getDueInstallments(clientId: string) {
    return prisma.paymentPlanInstallment.findMany({
      where: {
        paymentPlan: {
          clientId,
          status: 'active',
        },
        status: 'pending',
        dueDate: {
          lte: new Date(),
        },
      },
      include: {
        paymentPlan: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async cancelPaymentPlan(id: string) {
    return prisma.paymentPlan.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }

  async updatePaymentPlan(id: string, data: Record<string, unknown>) {
    return prisma.paymentPlan.update({ where: { id }, data });
  }

  async deletePaymentPlan(id: string) {
    return prisma.paymentPlan.delete({ where: { id } });
  }
}

export default new PaymentPlanService();
