import { PaymentPlanService } from '../../../src/services/payment-plan.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    paymentPlan: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('PaymentPlanService', () => {
  let paymentPlanService: PaymentPlanService;

  beforeEach(() => {
    paymentPlanService = new PaymentPlanService();
    jest.clearAllMocks();
  });

  describe('createPaymentPlan', () => {
    it('should create a payment plan successfully', async () => {
      const planData = {
        clientId: 'client-123',
        invoiceId: 'invoice-123',
        totalAmount: 1000,
        downPayment: 200,
        numberOfPayments: 4,
        paymentFrequency: 'monthly',
      };

      const expectedResult = {
        id: 'plan-123',
        ...planData,
        status: 'active',
        remainingBalance: 800,
        createdAt: new Date(),
      };

      (prisma.paymentPlan.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await paymentPlanService.createPaymentPlan(planData);

      expect(prisma.paymentPlan.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPaymentPlan', () => {
    it('should return a payment plan when found', async () => {
      const planId = 'plan-123';
      const expectedPlan = {
        id: planId,
        totalAmount: 1000,
        remainingBalance: 600,
      };

      (prisma.paymentPlan.findUnique as jest.Mock).mockResolvedValue(expectedPlan);

      const result = await paymentPlanService.getPaymentPlan(planId);

      expect(result).toEqual(expectedPlan);
    });

    it('should throw error when payment plan not found', async () => {
      const planId = 'non-existent';

      (prisma.paymentPlan.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(paymentPlanService.getPaymentPlan(planId)).rejects.toThrow(
        'Payment plan not found'
      );
    });
  });

  describe('listPaymentPlans', () => {
    it('should return paginated payment plans', async () => {
      const mockPlans = [
        { id: 'plan-1', totalAmount: 1000 },
        { id: 'plan-2', totalAmount: 1500 },
      ];

      (prisma.paymentPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);
      (prisma.paymentPlan.count as jest.Mock).mockResolvedValue(2);

      const result = await paymentPlanService.listPaymentPlans({});

      expect(result.data).toEqual(mockPlans);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updatePaymentPlan', () => {
    it('should update a payment plan successfully', async () => {
      const planId = 'plan-123';
      const updateData = { status: 'completed' };
      const existingPlan = { id: planId, status: 'active' };
      const updatedPlan = { ...existingPlan, ...updateData };

      (prisma.paymentPlan.findUnique as jest.Mock).mockResolvedValue(existingPlan);
      (prisma.paymentPlan.update as jest.Mock).mockResolvedValue(updatedPlan);

      const result = await paymentPlanService.updatePaymentPlan(planId, updateData);

      expect(result.status).toBe('completed');
    });
  });
});
