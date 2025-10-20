'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const medical_record_service_1 = require('../../../src/services/medical-record.service');
const database_1 = require('../../../src/config/database');
// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    medicalRecord: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));
describe('MedicalRecordService', () => {
  let medicalRecordService;
  beforeEach(() => {
    medicalRecordService = new medical_record_service_1.MedicalRecordService();
    jest.clearAllMocks();
  });
  describe('createMedicalRecord', () => {
    it('should create a medical record successfully', async () => {
      const recordData = {
        patientId: 'patient-123',
        veterinarianId: 'vet-123',
        visitDate: new Date('2024-12-01'),
        visitType: 'checkup',
        chiefComplaint: 'Annual checkup',
        diagnosis: 'Healthy',
      };
      const expectedResult = {
        id: 'record-123',
        ...recordData,
      };
      database_1.prisma.medicalRecord.create.mockResolvedValue(expectedResult);
      const result = await medicalRecordService.createMedicalRecord(recordData);
      expect(database_1.prisma.medicalRecord.create).toHaveBeenCalledWith({
        data: recordData,
        include: {
          patient: true,
          veterinarian: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });
  describe('getMedicalRecordById', () => {
    it('should return a medical record when found', async () => {
      const recordId = 'record-123';
      const expectedRecord = {
        id: recordId,
        patientId: 'patient-123',
        diagnosis: 'Healthy',
      };
      database_1.prisma.medicalRecord.findUnique.mockResolvedValue(expectedRecord);
      const result = await medicalRecordService.getMedicalRecordById(recordId);
      expect(result).toEqual(expectedRecord);
    });
    it('should throw error when medical record not found', async () => {
      const recordId = 'non-existent';
      database_1.prisma.medicalRecord.findUnique.mockResolvedValue(null);
      await expect(medicalRecordService.getMedicalRecordById(recordId)).rejects.toThrow(
        'Medical record not found'
      );
    });
  });
  describe('getRecordsByPatientId', () => {
    it('should return all medical records for a patient', async () => {
      const patientId = 'patient-123';
      const mockRecords = [
        { id: 'record-1', patientId, visitDate: new Date('2024-12-01') },
        { id: 'record-2', patientId, visitDate: new Date('2024-11-01') },
      ];
      database_1.prisma.medicalRecord.findMany.mockResolvedValue(mockRecords);
      const result = await medicalRecordService.getRecordsByPatientId(patientId);
      expect(database_1.prisma.medicalRecord.findMany).toHaveBeenCalledWith({
        where: { patientId },
        include: {
          patient: true,
          veterinarian: true,
        },
        orderBy: { visitDate: 'desc' },
      });
      expect(result).toEqual(mockRecords);
    });
  });
  describe('updateMedicalRecord', () => {
    it('should update a medical record successfully', async () => {
      const recordId = 'record-123';
      const updateData = { diagnosis: 'Updated diagnosis' };
      const existingRecord = { id: recordId, diagnosis: 'Original' };
      const updatedRecord = { ...existingRecord, ...updateData };
      database_1.prisma.medicalRecord.findUnique.mockResolvedValue(existingRecord);
      database_1.prisma.medicalRecord.update.mockResolvedValue(updatedRecord);
      const result = await medicalRecordService.updateMedicalRecord(recordId, updateData);
      expect(database_1.prisma.medicalRecord.update).toHaveBeenCalledWith({
        where: { id: recordId },
        data: updateData,
        include: {
          patient: true,
          veterinarian: true,
        },
      });
      expect(result.diagnosis).toBe('Updated diagnosis');
    });
    it('should throw error when updating non-existent record', async () => {
      const recordId = 'non-existent';
      database_1.prisma.medicalRecord.findUnique.mockResolvedValue(null);
      await expect(medicalRecordService.updateMedicalRecord(recordId, {})).rejects.toThrow(
        'Medical record not found'
      );
    });
  });
});
//# sourceMappingURL=medical-record.service.test.js.map
