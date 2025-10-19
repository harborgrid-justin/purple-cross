import { PrismaClient } from '@prisma/client';
import timeBlockService from '../../../src/services/time-block.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    timeBlock: {
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

describe('TimeBlockService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTimeBlock', () => {
    it('should create time block successfully', async () => {
      const mockData = {
        staffId: 'staff-1',
        blockType: 'vacation',
        title: 'Summer Vacation',
        startTime: new Date('2024-07-01'),
        endTime: new Date('2024-07-15'),
      };

      const mockResult = { id: '1', ...mockData };
      (prisma.timeBlock.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await timeBlockService.createTimeBlock(mockData);

      expect(prisma.timeBlock.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getTimeBlock', () => {
    it('should retrieve time block by id', async () => {
      const mockResult = {
        id: '1',
        staffId: 'staff-1',
        blockType: 'vacation',
      };

      (prisma.timeBlock.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await timeBlockService.getTimeBlock('1');

      expect(prisma.timeBlock.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('listTimeBlocks', () => {
    it('should list time blocks with filters', async () => {
      const mockItems = [
        { id: '1', staffId: 'staff-1', blockType: 'vacation' },
        { id: '2', staffId: 'staff-1', blockType: 'meeting' },
      ];

      (prisma.timeBlock.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.timeBlock.count as jest.Mock).mockResolvedValue(2);

      const result = await timeBlockService.listTimeBlocks({ staffId: 'staff-1' });

      expect(prisma.timeBlock.findMany).toHaveBeenCalled();
      expect(prisma.timeBlock.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });

  describe('updateTimeBlock', () => {
    it('should update time block successfully', async () => {
      const mockUpdate = { title: 'Updated Title' };
      const mockResult = { id: '1', ...mockUpdate };

      (prisma.timeBlock.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await timeBlockService.updateTimeBlock('1', mockUpdate);

      expect(prisma.timeBlock.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockUpdate,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteTimeBlock', () => {
    it('should delete time block successfully', async () => {
      const mockResult = { id: '1' };

      (prisma.timeBlock.delete as jest.Mock).mockResolvedValue(mockResult);

      const result = await timeBlockService.deleteTimeBlock('1');

      expect(prisma.timeBlock.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
