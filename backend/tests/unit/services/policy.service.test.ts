import { PrismaClient } from '@prisma/client';
import policyService from '../../../src/services/policy.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    policy: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    policyAcknowledgment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('PolicyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPolicy', () => {
    it('should create policy with active status', async () => {
      const mockData = {
        title: 'Privacy Policy',
        category: 'privacy',
        content: 'Policy content',
        version: '1.0',
        effectiveDate: new Date('2024-01-01'),
      };

      const mockResult = { id: '1', ...mockData, status: 'active' };
      (prisma.policy.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await policyService.createPolicy(mockData);

      expect(prisma.policy.create).toHaveBeenCalledWith({
        data: { ...mockData, status: 'active' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getPolicy', () => {
    it('should retrieve policy with acknowledgments', async () => {
      const mockResult = {
        id: '1',
        title: 'Privacy Policy',
        acknowledgments: [],
      };

      (prisma.policy.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await policyService.getPolicy('1');

      expect(prisma.policy.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          acknowledgments: { orderBy: { acknowledgedAt: 'desc' }, take: 10 },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('acknowledgePolicy', () => {
    it('should create policy acknowledgment', async () => {
      const mockResult = {
        id: '1',
        policyId: 'policy-1',
        userId: 'user-1',
        ipAddress: '127.0.0.1',
      };

      (prisma.policyAcknowledgment.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await policyService.acknowledgePolicy('policy-1', 'user-1', '127.0.0.1');

      expect(prisma.policyAcknowledgment.create).toHaveBeenCalledWith({
        data: { policyId: 'policy-1', userId: 'user-1', ipAddress: '127.0.0.1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('listPolicies', () => {
    it('should list policies with filters', async () => {
      const mockItems = [
        { id: '1', title: 'Privacy Policy', category: 'privacy' },
        { id: '2', title: 'Terms of Service', category: 'terms' },
      ];

      (prisma.policy.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.policy.count as jest.Mock).mockResolvedValue(2);

      const result = await policyService.listPolicies({ category: 'privacy' });

      expect(prisma.policy.findMany).toHaveBeenCalled();
      expect(prisma.policy.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });
});
