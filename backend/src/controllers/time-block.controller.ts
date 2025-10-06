import { Request, Response } from 'express';
import timeBlockService from '../services/time-block.service';

export class TimeBlockController {
  async create(req: Request, res: Response) {
    const timeBlock = await timeBlockService.createTimeBlock(req.body);
    res.status(201).json({ status: 'success', data: timeBlock });
  }

  async getById(req: Request, res: Response) {
    const timeBlock = await timeBlockService.getTimeBlock(req.params.id);
    res.status(200).json({ status: 'success', data: timeBlock });
  }

  async getAll(req: Request, res: Response) {
    const { staffId, blockType, startDate, endDate, page, limit } = req.query;
    const result = await timeBlockService.listTimeBlocks({
      staffId: staffId as string,
      blockType: blockType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response) {
    const timeBlock = await timeBlockService.updateTimeBlock(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: timeBlock });
  }

  async delete(req: Request, res: Response) {
    await timeBlockService.deleteTimeBlock(req.params.id);
    res.status(204).send();
  }
}

export default new TimeBlockController();
