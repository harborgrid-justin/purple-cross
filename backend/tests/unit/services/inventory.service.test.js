'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const inventory_service_1 = require('../../../src/services/inventory.service');
const database_1 = require('../../../src/config/database');
// Mock Prisma
jest.mock('../../../src/config/database', () => ({
  prisma: {
    inventoryItem: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  },
}));
describe('InventoryService', () => {
  let inventoryService;
  beforeEach(() => {
    inventoryService = new inventory_service_1.InventoryService();
    jest.clearAllMocks();
  });
  describe('createInventoryItem', () => {
    it('should create an inventory item successfully', async () => {
      const itemData = {
        name: 'Bandages',
        sku: 'BND-001',
        category: 'Medical Supplies',
        quantity: 100,
        unitPrice: 5.99,
        reorderPoint: 20,
      };
      const expectedResult = {
        id: 'item-123',
        ...itemData,
      };
      database_1.prisma.inventoryItem.create.mockResolvedValue(expectedResult);
      const result = await inventoryService.createInventoryItem(itemData);
      expect(database_1.prisma.inventoryItem.create).toHaveBeenCalledWith({
        data: itemData,
      });
      expect(result).toEqual(expectedResult);
    });
  });
  describe('getInventoryItemById', () => {
    it('should return an inventory item when found', async () => {
      const itemId = 'item-123';
      const expectedItem = {
        id: itemId,
        name: 'Bandages',
        quantity: 100,
      };
      database_1.prisma.inventoryItem.findUnique.mockResolvedValue(expectedItem);
      const result = await inventoryService.getInventoryItemById(itemId);
      expect(result).toEqual(expectedItem);
    });
    it('should throw error when item not found', async () => {
      const itemId = 'non-existent';
      database_1.prisma.inventoryItem.findUnique.mockResolvedValue(null);
      await expect(inventoryService.getInventoryItemById(itemId)).rejects.toThrow(
        'Inventory item not found'
      );
    });
  });
  describe('getAllInventoryItems', () => {
    it('should return paginated inventory items', async () => {
      const mockItems = [
        { id: 'item-1', name: 'Bandages', quantity: 100 },
        { id: 'item-2', name: 'Syringes', quantity: 50 },
      ];
      database_1.prisma.inventoryItem.findMany.mockResolvedValue(mockItems);
      database_1.prisma.inventoryItem.count.mockResolvedValue(2);
      const result = await inventoryService.getAllInventoryItems({});
      expect(result.data).toEqual(mockItems);
      expect(result.pagination.total).toBe(2);
    });
    it('should filter items by category', async () => {
      const category = 'Medical Supplies';
      const mockItems = [{ id: 'item-1', category }];
      database_1.prisma.inventoryItem.findMany.mockResolvedValue(mockItems);
      database_1.prisma.inventoryItem.count.mockResolvedValue(1);
      await inventoryService.getAllInventoryItems({ category });
      expect(database_1.prisma.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category }),
        })
      );
    });
    it('should filter by search term', async () => {
      const search = 'Bandage';
      const mockItems = [{ id: 'item-1', name: 'Bandages' }];
      database_1.prisma.inventoryItem.findMany.mockResolvedValue(mockItems);
      database_1.prisma.inventoryItem.count.mockResolvedValue(1);
      await inventoryService.getAllInventoryItems({ search });
      expect(database_1.prisma.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });
  });
  describe('updateInventoryItem', () => {
    it('should update an inventory item successfully', async () => {
      const itemId = 'item-123';
      const updateData = { quantity: 150 };
      const existingItem = { id: itemId, quantity: 100 };
      const updatedItem = { ...existingItem, ...updateData };
      database_1.prisma.inventoryItem.findUnique.mockResolvedValue(existingItem);
      database_1.prisma.inventoryItem.update.mockResolvedValue(updatedItem);
      const result = await inventoryService.updateInventoryItem(itemId, updateData);
      expect(result.quantity).toBe(150);
    });
    it('should throw error when updating non-existent item', async () => {
      const itemId = 'non-existent';
      database_1.prisma.inventoryItem.findUnique.mockResolvedValue(null);
      await expect(inventoryService.updateInventoryItem(itemId, {})).rejects.toThrow(
        'Inventory item not found'
      );
    });
  });
  describe('deleteInventoryItem', () => {
    it('should delete an inventory item successfully', async () => {
      const itemId = 'item-123';
      const existingItem = { id: itemId, name: 'Bandages' };
      database_1.prisma.inventoryItem.findUnique.mockResolvedValue(existingItem);
      database_1.prisma.inventoryItem.delete.mockResolvedValue(existingItem);
      const result = await inventoryService.deleteInventoryItem(itemId);
      expect(database_1.prisma.inventoryItem.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
      expect(result).toEqual(existingItem);
    });
  });
});
//# sourceMappingURL=inventory.service.test.js.map
