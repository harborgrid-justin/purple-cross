import { Request, Response } from 'express';
import inventoryService from '../services/inventory.service';
import { HTTP_STATUS } from '../constants';

export class InventoryController {
  async create(req: Request, res: Response): Promise<void> {
    const item = await inventoryService.createInventoryItem(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: item,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: item,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, category, search, lowStock } = req.query;
    const result = await inventoryService.getAllInventoryItems({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
      lowStock: lowStock === 'true',
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: item,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await inventoryService.deleteInventoryItem(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new InventoryController();
