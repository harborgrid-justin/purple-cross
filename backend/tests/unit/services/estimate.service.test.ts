import { EstimateService } from '../../../src/services/estimate.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    estimate: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('EstimateService', () => {
  let estimateService: EstimateService;
  let mockPrisma: any;

  beforeEach(() => {
    estimateService = new EstimateService();
    const prismaInstance = new PrismaClient();
    mockPrisma = prismaInstance;
    jest.clearAllMocks();
  });

  describe('createEstimate', () => {
    it('should create an estimate successfully', async () => {
      const estimateData = {
        clientId: 'client-123',
        patientId: 'patient-123',
        title: 'Annual Checkup Estimate',
        description: 'Estimate for annual checkup',
        lineItems: [
          {
            description: 'Physical Examination',
            quantity: 1,
            unitPrice: 50,
            itemType: 'service',
          },
        ],
        validUntil: new Date('2024-12-31'),
        notes: 'Valid for 30 days',
      };

      const expectedResult = {
        id: 'estimate-123',
        estimateNumber: 'EST-2024-001',
        ...estimateData,
        subtotal: 50,
        tax: 4,
        total: 54,
        status: 'draft',
        createdAt: new Date(),
      };

      // Mock the generate number method
      jest.spyOn(estimateService as any, 'generateEstimateNumber').mockResolvedValue('EST-2024-001');
      mockPrisma.estimate.create.mockResolvedValue(expectedResult);

      const result = await estimateService.createEstimate(estimateData);

      expect(mockPrisma.estimate.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEstimate', () => {
    it('should return an estimate when found', async () => {
      const estimateId = 'estimate-123';
      const expectedEstimate = {
        id: estimateId,
        estimateNumber: 'EST-2024-001',
        total: 100,
      };

      mockPrisma.estimate.findUnique.mockResolvedValue(expectedEstimate);

      const result = await estimateService.getEstimate(estimateId);

      expect(result).toEqual(expectedEstimate);
    });
  });

  describe('listEstimates', () => {
    it('should return paginated estimates', async () => {
      const mockEstimates = [
        { id: 'estimate-1', estimateNumber: 'EST-001' },
        { id: 'estimate-2', estimateNumber: 'EST-002' },
      ];

      mockPrisma.estimate.findMany.mockResolvedValue(mockEstimates);
      mockPrisma.estimate.count.mockResolvedValue(2);

      const result = await estimateService.listEstimates({});

      expect(result.items).toEqual(mockEstimates);
      expect(result.total).toBe(2);
    });
  });

  describe('updateEstimate', () => {
    it('should update an estimate successfully', async () => {
      const estimateId = 'estimate-123';
      const updateData = { status: 'approved' };
      const expectedResult = {
        id: estimateId,
        status: 'approved',
      };

      mockPrisma.estimate.update.mockResolvedValue(expectedResult);

      const result = await estimateService.updateEstimate(estimateId, updateData);

      expect(result.status).toBe('approved');
    });
  });
});
