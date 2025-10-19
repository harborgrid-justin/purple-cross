import { PrismaClient } from '@prisma/client';
import patientRelationshipService from '../../../src/services/patient-relationship.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    patientRelationship: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('PatientRelationshipService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRelationship', () => {
    it('should create patient relationship successfully', async () => {
      const mockData = {
        patientId: 'patient-1',
        relatedPatientId: 'patient-2',
        relationshipType: 'sibling',
      };

      const mockResult = { id: '1', ...mockData };
      (prisma.patientRelationship.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientRelationshipService.createRelationship(mockData);

      expect(prisma.patientRelationship.create).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getRelationship', () => {
    it('should retrieve relationship by id', async () => {
      const mockResult = {
        id: '1',
        patientId: 'patient-1',
        relatedPatientId: 'patient-2',
      };

      (prisma.patientRelationship.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientRelationshipService.getRelationship('1');

      expect(prisma.patientRelationship.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getPatientRelationships', () => {
    it('should list all relationships for a patient', async () => {
      const mockItems = [
        { id: '1', patientId: 'patient-1', relationshipType: 'sibling' },
        { id: '2', patientId: 'patient-1', relationshipType: 'parent' },
      ];

      (prisma.patientRelationship.findMany as jest.Mock).mockResolvedValue(mockItems);

      const result = await patientRelationshipService.getPatientRelationships('patient-1');

      expect(prisma.patientRelationship.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('deleteRelationship', () => {
    it('should delete relationship successfully', async () => {
      const mockResult = { id: '1' };

      (prisma.patientRelationship.delete as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientRelationshipService.deleteRelationship('1');

      expect(prisma.patientRelationship.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
