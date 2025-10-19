import { PrismaClient } from '@prisma/client';
import breedInfoService from '../../../src/services/breed-info.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    breedInformation: {
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

describe('BreedInfoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBreedInfo', () => {
    it('should create breed info successfully', async () => {
      const mockData = {
        breed: 'Golden Retriever',
        species: 'Dog',
        commonHealthIssues: { dysplasia: 'Hip dysplasia' },
        averageLifespan: 12,
        temperament: 'Friendly, intelligent',
      };

      const mockResult = { id: '1', ...mockData };
      (prisma.breedInformation.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await breedInfoService.createBreedInfo(mockData);

      expect(prisma.breedInformation.create).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getBreedInfo', () => {
    it('should retrieve breed info by id', async () => {
      const mockResult = {
        id: '1',
        species: 'Dog',
        breed: 'Golden Retriever',
      };

      (prisma.breedInformation.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await breedInfoService.getBreedInfo('1');

      expect(prisma.breedInformation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('listBreedInfo', () => {
    it('should list breed info with filters', async () => {
      const mockItems = [
        { id: '1', species: 'Dog', breed: 'Golden Retriever' },
        { id: '2', species: 'Dog', breed: 'Labrador' },
      ];

      (prisma.breedInformation.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.breedInformation.count as jest.Mock).mockResolvedValue(2);

      const result = await breedInfoService.listBreedInfo({ species: 'Dog' });

      expect(prisma.breedInformation.findMany).toHaveBeenCalled();
      expect(prisma.breedInformation.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });

  describe('updateBreedInfo', () => {
    it('should update breed info successfully', async () => {
      const mockUpdate = { temperament: 'Very friendly', averageLifespan: 13 };
      const mockResult = { id: '1', ...mockUpdate };

      (prisma.breedInformation.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await breedInfoService.updateBreedInfo('1', mockUpdate);

      expect(prisma.breedInformation.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockUpdate,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteBreedInfo', () => {
    it('should delete breed info successfully', async () => {
      const mockResult = { id: '1', species: 'Dog' };

      (prisma.breedInformation.delete as jest.Mock).mockResolvedValue(mockResult);

      const result = await breedInfoService.deleteBreedInfo('1');

      expect(prisma.breedInformation.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
