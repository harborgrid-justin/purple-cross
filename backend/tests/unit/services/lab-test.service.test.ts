import { LabTestService } from '../../../src/services/lab-test.service';
import { prisma } from '../../../src/config/database';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    labTest: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('LabTestService', () => {
  let labTestService: LabTestService;

  beforeEach(() => {
    labTestService = new LabTestService();
    jest.clearAllMocks();
  });

  describe('createLabTest', () => {
    it('should create a lab test successfully', async () => {
      const testData = {
        patientId: 'patient-123',
        testType: 'Blood Test',
        status: 'pending',
      };

      const expectedResult = {
        id: 'test-123',
        ...testData,
      };

      (prisma.labTest.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await labTestService.createLabTest(testData);

      expect(prisma.labTest.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getLabTestById', () => {
    it('should return a lab test when found', async () => {
      const testId = 'test-123';
      const expectedTest = {
        id: testId,
        testType: 'Blood Test',
        status: 'completed',
      };

      (prisma.labTest.findUnique as jest.Mock).mockResolvedValue(expectedTest);

      const result = await labTestService.getLabTestById(testId);

      expect(result).toEqual(expectedTest);
    });

    it('should throw error when test not found', async () => {
      const testId = 'non-existent';

      (prisma.labTest.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(labTestService.getLabTestById(testId)).rejects.toThrow('Lab test not found');
    });
  });

  describe('getAllLabTests', () => {
    it('should return paginated lab tests', async () => {
      const mockTests = [
        { id: 'test-1', testType: 'Blood Test' },
        { id: 'test-2', testType: 'Urine Test' },
      ];

      (prisma.labTest.findMany as jest.Mock).mockResolvedValue(mockTests);
      (prisma.labTest.count as jest.Mock).mockResolvedValue(2);

      const result = await labTestService.getAllLabTests({});

      expect(result.data).toEqual(mockTests);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter tests by status', async () => {
      const status = 'pending';
      const mockTests = [{ id: 'test-1', status }];

      (prisma.labTest.findMany as jest.Mock).mockResolvedValue(mockTests);
      (prisma.labTest.count as jest.Mock).mockResolvedValue(1);

      await labTestService.getAllLabTests({ status });

      expect(prisma.labTest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status }),
        })
      );
    });
  });

  describe('updateLabTest', () => {
    it('should update a lab test successfully', async () => {
      const testId = 'test-123';
      const updateData = { status: 'completed' };
      const existingTest = { id: testId, status: 'pending' };
      const updatedTest = { ...existingTest, ...updateData };

      (prisma.labTest.findUnique as jest.Mock).mockResolvedValue(existingTest);
      (prisma.labTest.update as jest.Mock).mockResolvedValue(updatedTest);

      const result = await labTestService.updateLabTest(testId, updateData);

      expect(result.status).toBe('completed');
    });
  });
});
