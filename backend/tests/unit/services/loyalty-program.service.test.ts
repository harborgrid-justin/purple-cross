import { PrismaClient } from '@prisma/client';
import loyaltyProgramService from '../../../src/services/loyalty-program.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    loyaltyProgram: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    loyaltyTransaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('LoyaltyProgramService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProgram', () => {
    it('should create loyalty program with initial values', async () => {
      const mockResult = {
        id: '1',
        clientId: 'client-1',
        pointsBalance: 0,
        tier: 'bronze',
        lifetimePoints: 0,
        lifetimeSpending: 0,
      };

      (prisma.loyaltyProgram.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await loyaltyProgramService.createProgram('client-1');

      expect(prisma.loyaltyProgram.create).toHaveBeenCalledWith({
        data: {
          clientId: 'client-1',
          pointsBalance: 0,
          tier: 'bronze',
          lifetimePoints: 0,
          lifetimeSpending: 0,
        },
      });
      expect(result.tier).toBe('bronze');
    });
  });

  describe('addPoints', () => {
    it('should add points and update tier', async () => {
      const mockProgram = {
        id: '1',
        clientId: 'client-1',
        pointsBalance: 500,
        tier: 'bronze',
        lifetimePoints: 500,
        lifetimeSpending: 5000,
        transactions: [],
      };

      const updatedProgram = {
        ...mockProgram,
        pointsBalance: 600,
        lifetimePoints: 600,
        tier: 'bronze',
      };

      (prisma.loyaltyProgram.findUnique as jest.Mock).mockResolvedValue(mockProgram);
      (prisma.loyaltyProgram.update as jest.Mock).mockResolvedValue(updatedProgram);
      (prisma.loyaltyTransaction.create as jest.Mock).mockResolvedValue({});

      const result = await loyaltyProgramService.addPoints('client-1', 100, 'Purchase bonus');

      expect(prisma.loyaltyProgram.update).toHaveBeenCalled();
      expect(prisma.loyaltyTransaction.create).toHaveBeenCalledWith({
        data: {
          loyaltyProgramId: '1',
          transactionType: 'earn',
          points: 100,
          description: 'Purchase bonus',
          relatedType: undefined,
          relatedId: undefined,
        },
      });
      expect(result.pointsBalance).toBe(600);
    });

    it('should upgrade tier when reaching threshold', async () => {
      const mockProgram = {
        id: '1',
        clientId: 'client-1',
        pointsBalance: 950,
        tier: 'bronze',
        lifetimePoints: 950,
        lifetimeSpending: 5000,
        transactions: [],
      };

      const updatedProgram = {
        ...mockProgram,
        pointsBalance: 1050,
        lifetimePoints: 1050,
        tier: 'silver',
      };

      (prisma.loyaltyProgram.findUnique as jest.Mock).mockResolvedValue(mockProgram);
      (prisma.loyaltyProgram.update as jest.Mock).mockResolvedValue(updatedProgram);
      (prisma.loyaltyTransaction.create as jest.Mock).mockResolvedValue({});

      const result = await loyaltyProgramService.addPoints('client-1', 100, 'Tier upgrade');

      expect(result.tier).toBe('silver');
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const mockProgram = {
        id: '1',
        clientId: 'client-1',
        pointsBalance: 500,
        tier: 'bronze',
        lifetimePoints: 500,
        lifetimeSpending: 5000,
        transactions: [],
      };

      const updatedProgram = {
        ...mockProgram,
        pointsBalance: 400,
      };

      (prisma.loyaltyProgram.findUnique as jest.Mock).mockResolvedValue(mockProgram);
      (prisma.loyaltyProgram.update as jest.Mock).mockResolvedValue(updatedProgram);
      (prisma.loyaltyTransaction.create as jest.Mock).mockResolvedValue({});

      const result = await loyaltyProgramService.redeemPoints('client-1', 100, 'Discount applied');

      expect(result.pointsBalance).toBe(400);
      expect(prisma.loyaltyTransaction.create).toHaveBeenCalledWith({
        data: {
          loyaltyProgramId: '1',
          transactionType: 'redeem',
          points: -100,
          description: 'Discount applied',
        },
      });
    });

    it('should throw error when insufficient points', async () => {
      const mockProgram = {
        id: '1',
        clientId: 'client-1',
        pointsBalance: 50,
        transactions: [],
      };

      (prisma.loyaltyProgram.findUnique as jest.Mock).mockResolvedValue(mockProgram);

      await expect(
        loyaltyProgramService.redeemPoints('client-1', 100, 'Discount')
      ).rejects.toThrow('Insufficient points');
    });
  });
});
