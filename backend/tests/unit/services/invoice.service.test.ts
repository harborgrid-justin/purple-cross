import { InvoiceService } from '../../../src/services/invoice.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceService = new InvoiceService();
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const invoiceData = {
        clientId: 'client-123',
        invoiceNumber: 'INV-2024-001',
        issueDate: new Date('2024-12-01'),
        dueDate: new Date('2024-12-15'),
        subtotal: 100.0,
        tax: 10.0,
        total: 110.0,
        status: 'pending',
      };

      const expectedResult = {
        id: 'invoice-123',
        ...invoiceData,
      };

      (prisma.invoice.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await invoiceService.createInvoice(invoiceData);

      expect(prisma.invoice.create).toHaveBeenCalledWith({
        data: invoiceData,
        include: {
          client: true,
          items: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice when found', async () => {
      const invoiceId = 'invoice-123';
      const expectedInvoice = {
        id: invoiceId,
        invoiceNumber: 'INV-2024-001',
        total: 110.0,
      };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(expectedInvoice);

      const result = await invoiceService.getInvoiceById(invoiceId);

      expect(result).toEqual(expectedInvoice);
    });

    it('should throw error when invoice not found', async () => {
      const invoiceId = 'non-existent';

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(invoiceService.getInvoiceById(invoiceId)).rejects.toThrow('Invoice not found');
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice successfully', async () => {
      const invoiceId = 'invoice-123';
      const updateData = { status: 'paid' };
      const existingInvoice = { id: invoiceId, status: 'pending' };
      const updatedInvoice = { ...existingInvoice, ...updateData };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(existingInvoice);
      (prisma.invoice.update as jest.Mock).mockResolvedValue(updatedInvoice);

      const result = await invoiceService.updateInvoice(invoiceId, updateData);

      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: invoiceId },
        data: updateData,
        include: {
          client: true,
          items: true,
        },
      });
      expect(result.status).toBe('paid');
    });

    it('should throw error when updating non-existent invoice', async () => {
      const invoiceId = 'non-existent';

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(invoiceService.updateInvoice(invoiceId, {})).rejects.toThrow(
        'Invoice not found'
      );
    });
  });
});
