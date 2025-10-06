import { Request, Response } from 'express';
import documentTemplateService from '../services/document-template.service';
import { HTTP_STATUS } from '../constants';

export class DocumentTemplateController {
  async create(req: Request, res: Response): Promise<void> {
    const template = await documentTemplateService.createTemplate(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: template });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const template = await documentTemplateService.getTemplate(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { category, page, limit } = req.query;
    const result = await documentTemplateService.listTemplates({
      category: category as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async incrementUsage(req: Request, res: Response): Promise<void> {
    const template = await documentTemplateService.incrementUsage(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async signDocument(req: Request, res: Response): Promise<void> {
    const signature = await documentTemplateService.signDocument(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: signature });
  }

  async getDocumentSignatures(req: Request, res: Response): Promise<void> {
    const signatures = await documentTemplateService.getDocumentSignatures(req.params.documentId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: signatures });
  }

  async createWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await documentTemplateService.createWorkflow(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: workflow });
  }

  async advanceWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await documentTemplateService.advanceWorkflow(req.params.workflowId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: workflow });
  }

  async update(req: Request, res: Response): Promise<void> {
    const template = await documentTemplateService.updateTemplate(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: template });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await documentTemplateService.deleteTemplate(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new DocumentTemplateController();
