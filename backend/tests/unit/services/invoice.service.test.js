"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_service_1 = require("../../../src/services/invoice.service");
const database_1 = require("../../../src/config/database");
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
    let invoiceService;
    beforeEach(() => {
        invoiceService = new invoice_service_1.InvoiceService();
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
            database_1.prisma.invoice.create.mockResolvedValue(expectedResult);
            const result = await invoiceService.createInvoice(invoiceData);
            expect(database_1.prisma.invoice.create).toHaveBeenCalledWith({
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
            database_1.prisma.invoice.findUnique.mockResolvedValue(expectedInvoice);
            const result = await invoiceService.getInvoiceById(invoiceId);
            expect(result).toEqual(expectedInvoice);
        });
        it('should throw error when invoice not found', async () => {
            const invoiceId = 'non-existent';
            database_1.prisma.invoice.findUnique.mockResolvedValue(null);
            await expect(invoiceService.getInvoiceById(invoiceId)).rejects.toThrow('Invoice not found');
        });
    });
    describe('updateInvoice', () => {
        it('should update an invoice successfully', async () => {
            const invoiceId = 'invoice-123';
            const updateData = { status: 'paid' };
            const existingInvoice = { id: invoiceId, status: 'pending' };
            const updatedInvoice = { ...existingInvoice, ...updateData };
            database_1.prisma.invoice.findUnique.mockResolvedValue(existingInvoice);
            database_1.prisma.invoice.update.mockResolvedValue(updatedInvoice);
            const result = await invoiceService.updateInvoice(invoiceId, updateData);
            expect(database_1.prisma.invoice.update).toHaveBeenCalledWith({
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
            database_1.prisma.invoice.findUnique.mockResolvedValue(null);
            await expect(invoiceService.updateInvoice(invoiceId, {})).rejects.toThrow('Invoice not found');
        });
    });
});
//# sourceMappingURL=invoice.service.test.js.map