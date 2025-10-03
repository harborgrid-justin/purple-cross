import { Request, Response } from 'express';
import documentService from '../services/document.service';

export class DocumentController {
  async create(req: Request, res: Response) {
    const document = await documentService.createDocument(req.body);
    res.status(201).json({
      status: 'success',
      data: document,
    });
  }

  async getById(req: Request, res: Response) {
    const document = await documentService.getDocumentById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: document,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, entityType, entityId, category } = req.query;
    const result = await documentService.getAllDocuments({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      entityType: entityType as string,
      entityId: entityId as string,
      category: category as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const document = await documentService.updateDocument(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: document,
    });
  }

  async delete(req: Request, res: Response) {
    await documentService.deleteDocument(req.params.id);
    res.status(204).send();
  }
}

export default new DocumentController();
