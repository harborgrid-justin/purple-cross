import { PrismaClient } from '@prisma/client';
import patientReminderService from '../../../src/services/patient-reminder.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    patientReminder: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('PatientReminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReminder', () => {
    it('should create patient reminder successfully', async () => {
      const mockData = {
        patientId: 'patient-1',
        reminderType: 'vaccination',
        reminderDate: new Date('2024-12-01'),
        description: 'Time for annual vaccination',
      };

      const mockResult = { id: '1', ...mockData, status: 'pending' };
      (prisma.patientReminder.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientReminderService.createReminder(mockData);

      expect(prisma.patientReminder.create).toHaveBeenCalledWith({
        data: { ...mockData, status: 'pending' },
      });
      expect(result.status).toBe('pending');
    });
  });

  describe('getReminder', () => {
    it('should retrieve reminder by id', async () => {
      const mockResult = {
        id: '1',
        patientId: 'patient-1',
        reminderType: 'vaccination',
      };

      (prisma.patientReminder.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientReminderService.getReminder('1');

      expect(prisma.patientReminder.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('listReminders', () => {
    it('should list reminders with filters', async () => {
      const mockItems = [
        { id: '1', patientId: 'patient-1', status: 'pending' },
        { id: '2', patientId: 'patient-1', status: 'sent' },
      ];

      (prisma.patientReminder.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.patientReminder.count as jest.Mock).mockResolvedValue(2);

      const result = await patientReminderService.listReminders({ patientId: 'patient-1' });

      expect(prisma.patientReminder.findMany).toHaveBeenCalled();
      expect(prisma.patientReminder.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });

  describe('completeReminder', () => {
    it('should mark reminder as completed', async () => {
      const mockResult = {
        id: '1',
        status: 'completed',
        completedAt: expect.any(Date),
      };

      (prisma.patientReminder.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await patientReminderService.completeReminder('1');

      expect(prisma.patientReminder.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'completed', completedAt: expect.any(Date) },
      });
      expect(result.status).toBe('completed');
    });
  });
});
