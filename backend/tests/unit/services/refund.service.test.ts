import { PrismaClient } from '@prisma/client';
import refundService from '../../../src/services/refund.service';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    refund: {
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

describe('RefundService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRefund', () => {
    it('should create refund with generated refund number', async () => {
      const mockData = {
        clientId: 'client-1',
        invoiceId: 'invoice-1',
        amount: 100,
        reason: 'Service not rendered',
        refundMethod: 'credit_card',
        processedBy: 'staff-1',
      };

      (prisma.refund.count as jest.Mock).mockResolvedValue(5);
      const mockResult = {
        id: '1',
        ...mockData,
        refundNumber: `REF-${new Date().getFullYear()}-00006`,
        status: 'pending',
      };
      (prisma.refund.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await refundService.createRefund(mockData);

      expect(prisma.refund.count).toHaveBeenCalled();
      expect(prisma.refund.create).toHaveBeenCalled();
      expect(result.status).toBe('pending');
      expect(result.refundNumber).toContain('REF-');
    });
  });

  describe('getRefund', () => {
    it('should retrieve refund by id', async () => {
      const mockResult = {
        id: '1',
        clientId: 'client-1',
        amount: 100,
      };

      (prisma.refund.findUnique as jest.Mock).mockResolvedValue(mockResult);

      const result = await refundService.getRefund('1');

      expect(prisma.refund.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockResult);
    });
  });

  describe('processRefund', () => {
    it('should update refund status to processed', async () => {
      const mockResult = {
        id: '1',
        status: 'processed',
        processedDate: expect.any(Date),
      };

      (prisma.refund.update as jest.Mock).mockResolvedValue(mockResult);

      const result = await refundService.processRefund('1');

      expect(prisma.refund.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'processed', processedDate: expect.any(Date) },
      });
      expect(result.status).toBe('processed');
    });
  });

  describe('listRefunds', () => {
    it('should list refunds with filters', async () => {
      const mockItems = [
        { id: '1', clientId: 'client-1', amount: 100 },
        { id: '2', clientId: 'client-1', amount: 50 },
      ];

      (prisma.refund.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prisma.refund.count as jest.Mock).mockResolvedValue(2);

      const result = await refundService.listRefunds({ clientId: 'client-1' });

      expect(prisma.refund.findMany).toHaveBeenCalled();
      expect(prisma.refund.count).toHaveBeenCalled();
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(2);
    });
  });
});
