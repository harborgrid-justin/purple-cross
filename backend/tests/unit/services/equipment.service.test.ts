import { PrismaClient } from '@prisma/client';
import equipmentService from '../../../src/services/equipment.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    equipment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    equipmentMaintenance: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('EquipmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEquipment', () => {
    it('should create equipment with active status', async () => {
      const mockData = {
        name: 'X-Ray Machine',
        category: 'diagnostic',
        manufacturer: 'MedTech',
        modelNumber: 'XR-2000',
        serialNumber: 'SN123456',
      };

      const mockResult = { id: '1', ...mockData, status: 'active' };
      (prisma.equipment.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await equipmentService.createEquipment(mockData);

      expect(prisma.equipment.create).toHaveBeenCalledWith({
        data: { ...mockData, status: 'active' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getEquipment', () => {
    it('should retrieve equipment with maintenance records', async () => {
      const mockResult = {
        id: '1',
        name: 'X-Ray Machine',
        maintenanceRecords: [],
      };

      (prisma.equipment.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await equipmentService.getEquipment('1');

      expect(prisma.equipment.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          maintenanceRecords: {
            orderBy: { scheduledDate: 'desc' },
            take: 10,
          },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('scheduleMaintenance', () => {
    it('should schedule maintenance for equipment', async () => {
      const mockData = {
        equipmentId: 'equipment-1',
        maintenanceType: 'calibration',
        scheduledDate: new Date('2024-12-01'),
        performedBy: 'technician-1',
      };

      const mockResult = { id: '1', ...mockData, status: 'scheduled' };
      (prisma.equipmentMaintenance.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await equipmentService.scheduleMaintenance(mockData);

      expect(prisma.equipmentMaintenance.create).toHaveBeenCalledWith({
        data: { ...mockData, status: 'scheduled' },
      });
      expect(result.status).toBe('scheduled');
    });
  });

  describe('completeMaintenance', () => {
    it('should mark maintenance as completed', async () => {
      const mockData = {
        completedDate: new Date('2024-12-01'),
        performedBy: 'technician-1',
        cost: 500,
        notes: 'Calibration successful',
      };

      const mockResult = { id: '1', ...mockData, status: 'completed' };
      (prisma.equipmentMaintenance.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await equipmentService.completeMaintenance('1', mockData);

      expect(prisma.equipmentMaintenance.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...mockData, status: 'completed' },
      });
      expect(result.status).toBe('completed');
    });
  });

  describe('getUpcomingMaintenance', () => {
    it('should retrieve upcoming scheduled maintenance', async () => {
      const mockItems = [
        { id: '1', status: 'scheduled', scheduledDate: new Date('2024-12-15') },
      ];

      (prisma.equipmentMaintenance.findMany as jest.Mock).mockResolvedValue(mockItems);

      const result = await equipmentService.getUpcomingMaintenance(30);

      expect(prisma.equipmentMaintenance.findMany).toHaveBeenCalledWith({
        where: {
          status: 'scheduled',
          scheduledDate: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        include: { equipment: true },
        orderBy: { scheduledDate: 'asc' },
      });
      expect(result).toEqual(mockItems);
    });
  });
});
