import { Request, Response } from 'express';
import timeBlockService from '../services/time-block.service';
import { HTTP_STATUS } from '../constants';

export class TimeBlockController {
  async create(req: Request, res: Response): Promise<void> {
    const timeBlock = await timeBlockService.createTimeBlock(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: timeBlock });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const timeBlock = await timeBlockService.getTimeBlock(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: timeBlock });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { staffId, blockType, startDate, endDate, page, limit } = req.query;
    const result = await timeBlockService.listTimeBlocks({
      staffId: staffId as string,
      blockType: blockType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response): Promise<void> {
    const timeBlock = await timeBlockService.updateTimeBlock(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: timeBlock });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await timeBlockService.deleteTimeBlock(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new TimeBlockController();
