import { Request, Response } from 'express';
import reportTemplateService from '../services/report-template.service';
import { HTTP_STATUS } from '../constants';

export class ReportTemplateController {
  async create(req: Request, res: Response): Promise<void> {
    const template = await reportTemplateService.createTemplate(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: template });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const template = await reportTemplateService.getTemplate(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { reportType, category, createdBy, isPublic, page, limit } = req.query;
    const result = await reportTemplateService.listTemplates({
      reportType: reportType as string,
      category: category as string,
      createdBy: createdBy as string,
      isPublic: isPublic === 'true',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async incrementUsage(req: Request, res: Response): Promise<void> {
    const template = await reportTemplateService.incrementUsage(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async scheduleReport(req: Request, res: Response): Promise<void> {
    const schedule = await reportTemplateService.scheduleReport(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: schedule });
  }

  async getScheduledReports(_req: Request, res: Response) {
    const schedules = await reportTemplateService.getScheduledReports();
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: schedules });
  }

  async update(req: Request, res: Response): Promise<void> {
    const template = await reportTemplateService.updateTemplate(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await reportTemplateService.deleteTemplate(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new ReportTemplateController();
