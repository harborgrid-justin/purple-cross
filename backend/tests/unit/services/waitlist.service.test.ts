import { PrismaClient } from '@prisma/client';
import waitlistService from '../../../src/services/waitlist.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    waitlist: {
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

describe('WaitlistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWaitlist', () => {
    it('should add entry to waitlist successfully', async () => {
      const mockData = {
        clientId: 'client-1',
        patientId: 'patient-1',
        appointmentType: 'checkup',
        reason: 'Regular checkup needed',
        urgency: 'routine',
      };

      const mockResult = { id: '1', ...mockData, status: 'active' };
      (prisma.waitlist.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await waitlistService.addToWaitlist(mockData);

      expect(prisma.waitlist.create).toHaveBeenCalledWith({
        data: { ...mockData, status: 'active' },
      });
      expect(result.status).toBe('active');
    });
  });

  describe('getWaitlistEntry', () => {
    it('should retrieve waitlist entry by id', async () => {
      const mockResult = {
        id: '1',
        clientId: 'client-1',
        status: 'active',
      };

      (prisma.waitlist.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await waitlistService.getWaitlistEntry('1');

      expect(prisma.waitlist.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('listWaitlist', () => {
    it('should list waitlist entries with filters', async () => {
      const mockItems = [
        { id: '1', status: 'active', urgency: 'urgent' },
        { id: '2', status: 'active', urgency: 'routine' },
      ];

      (prisma.waitlist.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.waitlist.count as jest.Mock).mockResolvedValue(2);

      const result = await waitlistService.listWaitlist({ status: 'active' });

      expect(prisma.waitlist.findMany).toHaveBeenCalled();
      expect(prisma.waitlist.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });

  describe('bookWaitlistEntry', () => {
    it('should mark waitlist entry as booked', async () => {
      const mockResult = { id: '1', status: 'booked', bookedAt: expect.any(Date) };

      (prisma.waitlist.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await waitlistService.bookWaitlistEntry('1');

      expect(prisma.waitlist.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'booked', bookedAt: expect.any(Date) },
      });
      expect(result.status).toBe('booked');
    });
  });
});
