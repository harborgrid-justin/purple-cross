import { Request, Response } from 'express';
import communicationService from '../services/communication.service';
import { HTTP_STATUS } from '../constants';

export class CommunicationController {
  async create(req: Request, res: Response): Promise<void> {
    const communication = await communicationService.createCommunication(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: communication,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const communication = await communicationService.getCommunicationById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: communication,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, clientId, type } = req.query;
    const result = await communicationService.getAllCommunications({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      clientId: clientId as string,
      type: type as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const communication = await communicationService.updateCommunication(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: communication,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await communicationService.deleteCommunication(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new CommunicationController();
