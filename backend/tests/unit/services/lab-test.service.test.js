'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const lab_test_service_1 = require('../../../src/services/lab-test.service');
const database_1 = require('../../../src/config/database');
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
  let labTestService;
  beforeEach(() => {
    labTestService = new lab_test_service_1.LabTestService();
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
      database_1.prisma.labTest.create.mockResolvedValue(expectedResult);
      const result = await labTestService.createLabTest(testData);
      expect(database_1.prisma.labTest.create).toHaveBeenCalled();
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
      database_1.prisma.labTest.findUnique.mockResolvedValue(expectedTest);
      const result = await labTestService.getLabTestById(testId);
      expect(result).toEqual(expectedTest);
    });
    it('should throw error when test not found', async () => {
      const testId = 'non-existent';
      database_1.prisma.labTest.findUnique.mockResolvedValue(null);
      await expect(labTestService.getLabTestById(testId)).rejects.toThrow('Lab test not found');
    });
  });
  describe('getAllLabTests', () => {
    it('should return paginated lab tests', async () => {
      const mockTests = [
        { id: 'test-1', testType: 'Blood Test' },
        { id: 'test-2', testType: 'Urine Test' },
      ];
      database_1.prisma.labTest.findMany.mockResolvedValue(mockTests);
      database_1.prisma.labTest.count.mockResolvedValue(2);
      const result = await labTestService.getAllLabTests({});
      expect(result.data).toEqual(mockTests);
      expect(result.pagination.total).toBe(2);
    });
    it('should filter tests by status', async () => {
      const status = 'pending';
      const mockTests = [{ id: 'test-1', status }];
      database_1.prisma.labTest.findMany.mockResolvedValue(mockTests);
      database_1.prisma.labTest.count.mockResolvedValue(1);
      await labTestService.getAllLabTests({ status });
      expect(database_1.prisma.labTest.findMany).toHaveBeenCalledWith(
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
      database_1.prisma.labTest.findUnique.mockResolvedValue(existingTest);
      database_1.prisma.labTest.update.mockResolvedValue(updatedTest);
      const result = await labTestService.updateLabTest(testId, updateData);
      expect(result.status).toBe('completed');
    });
  });
});
//# sourceMappingURL=lab-test.service.test.js.map
