import { Request, Response } from 'express';
import waitlistService from '../services/waitlist.service';
import { HTTP_STATUS } from '../constants';

export class WaitlistController {
  async create(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.addToWaitlist(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: entry });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.getWaitlistEntry(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: entry });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { appointmentType, urgency, status, page, limit } = req.query;
    const result = await waitlistService.listWaitlist({
      appointmentType: appointmentType as string,
      urgency: urgency as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async notify(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.notifyWaitlistEntry(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: entry });
  }

  async book(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.bookWaitlistEntry(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: entry });
  }

  async cancel(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.cancelWaitlistEntry(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: entry });
  }

  async update(req: Request, res: Response): Promise<void> {
    const entry = await waitlistService.updateWaitlistEntry(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: entry });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await waitlistService.deleteWaitlistEntry(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new WaitlistController();
