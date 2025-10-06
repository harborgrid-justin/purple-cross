import { Request, Response } from 'express';
import documentTemplateService from '../services/document-template.service';

export class DocumentTemplateController {
  async create(req: Request, res: Response) {
    const template = await documentTemplateService.createTemplate(req.body);
    res.status(201).json({ status: 'success', data: template });
  }

  async getById(req: Request, res: Response) {
    const template = await documentTemplateService.getTemplate(req.params.id);
    res.status(200).json({ status: 'success', data: template });
  }

  async getAll(req: Request, res: Response) {
    const { category, page, limit } = req.query;
    const result = await documentTemplateService.listTemplates({
      category: category as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async incrementUsage(req: Request, res: Response) {
    const template = await documentTemplateService.incrementUsage(req.params.id);
    res.status(200).json({ status: 'success', data: template });
  }

  async signDocument(req: Request, res: Response) {
    const signature = await documentTemplateService.signDocument(req.body);
    res.status(201).json({ status: 'success', data: signature });
  }

  async getDocumentSignatures(req: Request, res: Response) {
    const signatures = await documentTemplateService.getDocumentSignatures(req.params.documentId);
    res.status(200).json({ status: 'success', data: signatures });
  }

  async createWorkflow(req: Request, res: Response) {
    const workflow = await documentTemplateService.createWorkflow(req.body);
    res.status(201).json({ status: 'success', data: workflow });
  }

  async advanceWorkflow(req: Request, res: Response) {
    const workflow = await documentTemplateService.advanceWorkflow(req.params.workflowId);
    res.status(200).json({ status: 'success', data: workflow });
  }

  async update(req: Request, res: Response) {
    const template = await documentTemplateService.updateTemplate(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: template });
  }

  async delete(req: Request, res: Response) {
    await documentTemplateService.deleteTemplate(req.params.id);
    res.status(204).send();
  }
}

export default new DocumentTemplateController();
