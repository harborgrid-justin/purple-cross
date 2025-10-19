import { MedicalRecordService } from '../../../src/services/medical-record.service';
import { prisma } from '../../../src/config/database';

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
  let medicalRecordService: MedicalRecordService;

  beforeEach(() => {
    medicalRecordService = new MedicalRecordService();
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

      (prisma.medicalRecord.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await medicalRecordService.createMedicalRecord(recordData);

      expect(prisma.medicalRecord.create).toHaveBeenCalledWith({
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

      (prisma.medicalRecord.findUnique as jest.Mock).mockResolvedValue(expectedRecord);

      const result = await medicalRecordService.getMedicalRecordById(recordId);

      expect(result).toEqual(expectedRecord);
    });

    it('should throw error when medical record not found', async () => {
      const recordId = 'non-existent';

      (prisma.medicalRecord.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(medicalRecordService.getMedicalRecordById(recordId)).rejects.toThrow(
        'Medical record not found'
      );
    });
  });

  describe('getAllMedicalRecords', () => {
    it('should return all medical records for a patient', async () => {
      const patientId = 'patient-123';
      const mockRecords = [
        { id: 'record-1', patientId, visitDate: new Date('2024-12-01') },
        { id: 'record-2', patientId, visitDate: new Date('2024-11-01') },
      ];

      (prisma.medicalRecord.findMany as jest.Mock).mockResolvedValue(mockRecords);
      (prisma.medicalRecord.count as jest.Mock).mockResolvedValue(2);

      const result = await medicalRecordService.getAllMedicalRecords({ patientId });

      expect(result.data).toEqual(mockRecords);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update a medical record successfully', async () => {
      const recordId = 'record-123';
      const updateData = { diagnosis: 'Updated diagnosis' };
      const existingRecord = { id: recordId, diagnosis: 'Original' };
      const updatedRecord = { ...existingRecord, ...updateData };

      (prisma.medicalRecord.findUnique as jest.Mock).mockResolvedValue(existingRecord);
      (prisma.medicalRecord.update as jest.Mock).mockResolvedValue(updatedRecord);

      const result = await medicalRecordService.updateMedicalRecord(recordId, updateData);

      expect(prisma.medicalRecord.update).toHaveBeenCalledWith({
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

      (prisma.medicalRecord.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(medicalRecordService.updateMedicalRecord(recordId, {})).rejects.toThrow(
        'Medical record not found'
      );
    });
  });
});
