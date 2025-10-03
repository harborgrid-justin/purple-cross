import { Request, Response } from 'express';
import inventoryService from '../services/inventory.service';

export class InventoryController {
  async create(req: Request, res: Response) {
    const item = await inventoryService.createInventoryItem(req.body);
    res.status(201).json({
      status: 'success',
      data: item,
    });
  }

  async getById(req: Request, res: Response) {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: item,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, category, search, lowStock } = req.query;
    const result = await inventoryService.getAllInventoryItems({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
      lowStock: lowStock === 'true',
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: item,
    });
  }

  async delete(req: Request, res: Response) {
    await inventoryService.deleteInventoryItem(req.params.id);
    res.status(204).send();
  }
}

export default new InventoryController();
