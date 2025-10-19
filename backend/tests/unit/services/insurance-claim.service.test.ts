import { InsuranceClaimService } from '../../../src/services/insurance-claim.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    insuranceClaim: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('InsuranceClaimService', () => {
  let insuranceClaimService: InsuranceClaimService;

  beforeEach(() => {
    insuranceClaimService = new InsuranceClaimService();
    jest.clearAllMocks();
  });

  describe('createClaim', () => {
    it('should create an insurance claim successfully', async () => {
      const claimData = {
        patientId: 'patient-123',
        invoiceId: 'invoice-123',
        policyNumber: 'POL-123456',
        claimAmount: 500,
        diagnosis: 'Routine checkup',
      };

      const expectedResult = {
        id: 'claim-123',
        claimNumber: 'CLM-2024-001',
        ...claimData,
        status: 'pending',
        createdAt: new Date(),
      };

      (prisma.insuranceClaim.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await insuranceClaimService.createClaim(claimData);

      expect(prisma.insuranceClaim.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getClaim', () => {
    it('should return a claim when found', async () => {
      const claimId = 'claim-123';
      const expectedClaim = {
        id: claimId,
        claimNumber: 'CLM-2024-001',
        claimAmount: 500,
      };

      (prisma.insuranceClaim.findUnique as jest.Mock).mockResolvedValue(expectedClaim);

      const result = await insuranceClaimService.getClaim(claimId);

      expect(result).toEqual(expectedClaim);
    });

    it('should throw error when claim not found', async () => {
      const claimId = 'non-existent';

      (prisma.insuranceClaim.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(insuranceClaimService.getClaim(claimId)).rejects.toThrow(
        'Insurance claim not found'
      );
    });
  });

  describe('listClaims', () => {
    it('should return paginated claims', async () => {
      const mockClaims = [
        { id: 'claim-1', claimAmount: 500 },
        { id: 'claim-2', claimAmount: 750 },
      ];

      (prisma.insuranceClaim.findMany as jest.Mock).mockResolvedValue(mockClaims);
      (prisma.insuranceClaim.count as jest.Mock).mockResolvedValue(2);

      const result = await insuranceClaimService.listClaims({});

      expect(result.data).toEqual(mockClaims);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateClaim', () => {
    it('should update a claim successfully', async () => {
      const claimId = 'claim-123';
      const updateData = { status: 'approved' };
      const existingClaim = { id: claimId, status: 'pending' };
      const updatedClaim = { ...existingClaim, ...updateData };

      (prisma.insuranceClaim.findUnique as jest.Mock).mockResolvedValue(existingClaim);
      (prisma.insuranceClaim.update as jest.Mock).mockResolvedValue(updatedClaim);

      const result = await insuranceClaimService.updateClaim(claimId, updateData);

      expect(result.status).toBe('approved');
    });
  });
});
