import { Request, Response } from 'express';
import waitlistService from '../services/waitlist.service';

export class WaitlistController {
  async create(req: Request, res: Response) {
    const entry = await waitlistService.addToWaitlist(req.body);
    res.status(201).json({ status: 'success', data: entry });
  }

  async getById(req: Request, res: Response) {
    const entry = await waitlistService.getWaitlistEntry(req.params.id);
    res.status(200).json({ status: 'success', data: entry });
  }

  async getAll(req: Request, res: Response) {
    const { appointmentType, urgency, status, page, limit } = req.query;
    const result = await waitlistService.listWaitlist({
      appointmentType: appointmentType as string,
      urgency: urgency as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async notify(req: Request, res: Response) {
    const entry = await waitlistService.notifyWaitlistEntry(req.params.id);
    res.status(200).json({ status: 'success', data: entry });
  }

  async book(req: Request, res: Response) {
    const entry = await waitlistService.bookWaitlistEntry(req.params.id);
    res.status(200).json({ status: 'success', data: entry });
  }

  async cancel(req: Request, res: Response) {
    const entry = await waitlistService.cancelWaitlistEntry(req.params.id);
    res.status(200).json({ status: 'success', data: entry });
  }

  async delete(req: Request, res: Response) {
    await waitlistService.deleteWaitlistEntry(req.params.id);
    res.status(204).send();
  }
}

export default new WaitlistController();
