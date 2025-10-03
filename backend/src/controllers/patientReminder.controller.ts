import { Request, Response } from 'express';
import patientReminderService from '../services/patientReminder.service';

export class PatientReminderController {
  async create(req: Request, res: Response) {
    const reminder = await patientReminderService.createReminder(req.body);
    res.status(201).json({ status: 'success', data: reminder });
  }

  async getById(req: Request, res: Response) {
    const reminder = await patientReminderService.getReminder(req.params.id);
    res.status(200).json({ status: 'success', data: reminder });
  }

  async getAll(req: Request, res: Response) {
    const { patientId, reminderType, status, startDate, endDate, page, limit } = req.query;
    const result = await patientReminderService.listReminders({
      patientId: patientId as string,
      reminderType: reminderType as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async getDue(req: Request, res: Response) {
    const reminders = await patientReminderService.getDueReminders();
    res.status(200).json({ status: 'success', data: reminders });
  }

  async complete(req: Request, res: Response) {
    const reminder = await patientReminderService.completeReminder(req.params.id);
    res.status(200).json({ status: 'success', data: reminder });
  }

  async update(req: Request, res: Response) {
    const reminder = await patientReminderService.updateReminder(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: reminder });
  }

  async delete(req: Request, res: Response) {
    await patientReminderService.deleteReminder(req.params.id);
    res.status(204).send();
  }
}

export default new PatientReminderController();
