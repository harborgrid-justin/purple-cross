import { PurchaseOrderService } from '../../../src/services/purchase-order.service';
import { prisma } from '../../../src/config/database';

// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    purchaseOrder: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('PurchaseOrderService', () => {
  let purchaseOrderService: PurchaseOrderService;

  beforeEach(() => {
    purchaseOrderService = new PurchaseOrderService();
    jest.clearAllMocks();
  });

  describe('createPurchaseOrder', () => {
    it('should create a purchase order successfully', async () => {
      const orderData = {
        vendorId: 'vendor-123',
        orderDate: new Date('2024-01-15'),
        expectedDeliveryDate: new Date('2024-01-30'),
        totalAmount: 500,
        items: [
          {
            itemId: 'item-123',
            quantity: 10,
            unitPrice: 50,
          },
        ],
      };

      const expectedResult = {
        id: 'po-123',
        poNumber: 'PO-2024-001',
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
      };

      (prisma.purchaseOrder.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await purchaseOrderService.createPurchaseOrder(orderData);

      expect(prisma.purchaseOrder.create).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPurchaseOrder', () => {
    it('should return a purchase order when found', async () => {
      const orderId = 'po-123';
      const expectedOrder = {
        id: orderId,
        poNumber: 'PO-2024-001',
        totalAmount: 500,
      };

      (prisma.purchaseOrder.findUnique as jest.Mock).mockResolvedValue(expectedOrder);

      const result = await purchaseOrderService.getPurchaseOrder(orderId);

      expect(result).toEqual(expectedOrder);
    });

    it('should throw error when purchase order not found', async () => {
      const orderId = 'non-existent';

      (prisma.purchaseOrder.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(purchaseOrderService.getPurchaseOrder(orderId)).rejects.toThrow(
        'Purchase order not found'
      );
    });
  });

  describe('listPurchaseOrders', () => {
    it('should return paginated purchase orders', async () => {
      const mockOrders = [
        { id: 'po-1', poNumber: 'PO-001' },
        { id: 'po-2', poNumber: 'PO-002' },
      ];

      (prisma.purchaseOrder.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prisma.purchaseOrder.count as jest.Mock).mockResolvedValue(2);

      const result = await purchaseOrderService.listPurchaseOrders({});

      expect(result.data).toEqual(mockOrders);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updatePurchaseOrder', () => {
    it('should update a purchase order successfully', async () => {
      const orderId = 'po-123';
      const updateData = { status: 'received' };
      const existingOrder = { id: orderId, status: 'pending' };
      const updatedOrder = { ...existingOrder, ...updateData };

      (prisma.purchaseOrder.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.purchaseOrder.update as jest.Mock).mockResolvedValue(updatedOrder);

      const result = await purchaseOrderService.updatePurchaseOrder(orderId, updateData);

      expect(result.status).toBe('received');
    });
  });
});
