import { PrescriptionService } from '../../../src/services/prescription.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    prescription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('PrescriptionService', () => {
  let prescriptionService: PrescriptionService;

  beforeEach(() => {
    prescriptionService = new PrescriptionService();
    jest.clearAllMocks();
  });

  describe('createPrescription', () => {
    it('should create a prescription successfully', async () => {
      const prescriptionData = {
        patientId: 'patient-123',
        veterinarianId: 'vet-123',
        medicationName: 'Antibiotics',
        dosage: '500mg',
        frequency: 'twice daily',
        duration: 7,
        instructions: 'Take with food',
      };

      const expectedResult = {
        id: 'prescription-123',
        ...prescriptionData,
        status: 'active',
      };

      (prisma.prescription.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await prescriptionService.createPrescription(prescriptionData);

      expect(prisma.prescription.create).toHaveBeenCalledWith({
        data: prescriptionData,
        include: {
          patient: true,
          veterinarian: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPrescriptionById', () => {
    it('should return a prescription when found', async () => {
      const prescriptionId = 'prescription-123';
      const expectedPrescription = {
        id: prescriptionId,
        medicationName: 'Antibiotics',
        dosage: '500mg',
      };

      (prisma.prescription.findUnique as jest.Mock).mockResolvedValue(expectedPrescription);

      const result = await prescriptionService.getPrescriptionById(prescriptionId);

      expect(result).toEqual(expectedPrescription);
    });

    it('should throw error when prescription not found', async () => {
      const prescriptionId = 'non-existent';

      (prisma.prescription.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(prescriptionService.getPrescriptionById(prescriptionId)).rejects.toThrow(
        'Prescription not found'
      );
    });
  });

  describe('getPrescriptionsByPatientId', () => {
    it('should return all prescriptions for a patient', async () => {
      const patientId = 'patient-123';
      const mockPrescriptions = [
        { id: 'prescription-1', patientId, medicationName: 'Med A', status: 'active' },
        { id: 'prescription-2', patientId, medicationName: 'Med B', status: 'completed' },
      ];

      (prisma.prescription.findMany as jest.Mock).mockResolvedValue(mockPrescriptions);

      const result = await prescriptionService.getPrescriptionsByPatientId(patientId);

      expect(prisma.prescription.findMany).toHaveBeenCalledWith({
        where: { patientId },
        include: {
          patient: true,
          veterinarian: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockPrescriptions);
    });

    it('should filter prescriptions by status', async () => {
      const patientId = 'patient-123';
      const status = 'active';
      const mockPrescriptions = [{ id: 'prescription-1', patientId, status: 'active' }];

      (prisma.prescription.findMany as jest.Mock).mockResolvedValue(mockPrescriptions);

      await prescriptionService.getPrescriptionsByPatientId(patientId, status);

      expect(prisma.prescription.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { patientId, status },
        })
      );
    });
  });

  describe('updatePrescription', () => {
    it('should update a prescription successfully', async () => {
      const prescriptionId = 'prescription-123';
      const updateData = { status: 'completed' };
      const existingPrescription = { id: prescriptionId, status: 'active' };
      const updatedPrescription = { ...existingPrescription, ...updateData };

      (prisma.prescription.findUnique as jest.Mock).mockResolvedValue(existingPrescription);
      (prisma.prescription.update as jest.Mock).mockResolvedValue(updatedPrescription);

      const result = await prescriptionService.updatePrescription(prescriptionId, updateData);

      expect(prisma.prescription.update).toHaveBeenCalledWith({
        where: { id: prescriptionId },
        data: updateData,
        include: {
          patient: true,
          veterinarian: true,
        },
      });
      expect(result.status).toBe('completed');
    });
  });
});
