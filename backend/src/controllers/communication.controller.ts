import { Request, Response } from 'express';
import communicationService from '../services/communication.service';

export class CommunicationController {
  async create(req: Request, res: Response) {
    const communication = await communicationService.createCommunication(req.body);
    res.status(201).json({
      status: 'success',
      data: communication,
    });
  }

  async getById(req: Request, res: Response) {
    const communication = await communicationService.getCommunicationById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: communication,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, clientId, type } = req.query;
    const result = await communicationService.getAllCommunications({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      clientId: clientId as string,
      type: type as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const communication = await communicationService.updateCommunication(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: communication,
    });
  }

  async delete(req: Request, res: Response) {
    await communicationService.deleteCommunication(req.params.id);
    res.status(204).send();
  }
}

export default new CommunicationController();
