import { Request, Response } from 'express';
import reportTemplateService from '../services/report-template.service';

export class ReportTemplateController {
  async create(req: Request, res: Response) {
    const template = await reportTemplateService.createTemplate(req.body);
    res.status(201).json({ status: 'success', data: template });
  }

  async getById(req: Request, res: Response) {
    const template = await reportTemplateService.getTemplate(req.params.id);
    res.status(200).json({ status: 'success', data: template });
  }

  async getAll(req: Request, res: Response) {
    const { reportType, category, createdBy, isPublic, page, limit } = req.query;
    const result = await reportTemplateService.listTemplates({
      reportType: reportType as string,
      category: category as string,
      createdBy: createdBy as string,
      isPublic: isPublic === 'true',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async incrementUsage(req: Request, res: Response) {
    const template = await reportTemplateService.incrementUsage(req.params.id);
    res.status(200).json({ status: 'success', data: template });
  }

  async scheduleReport(req: Request, res: Response) {
    const schedule = await reportTemplateService.scheduleReport(req.body);
    res.status(201).json({ status: 'success', data: schedule });
  }

  async getScheduledReports(req: Request, res: Response) {
    const schedules = await reportTemplateService.getScheduledReports();
    res.status(200).json({ status: 'success', data: schedules });
  }

  async update(req: Request, res: Response) {
    const template = await reportTemplateService.updateTemplate(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: template });
  }

  async delete(req: Request, res: Response) {
    await reportTemplateService.deleteTemplate(req.params.id);
    res.status(204).send();
  }
}

export default new ReportTemplateController();
