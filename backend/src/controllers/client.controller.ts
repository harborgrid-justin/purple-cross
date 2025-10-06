import { Request, Response } from 'express';
import clientService from '../services/client.service';
import { HTTP_STATUS } from '../constants';

export class ClientController {
  async create(req: Request, res: Response): Promise<void> {
    const client = await clientService.createClient(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: client,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const client = await clientService.getClientById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: client,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit, search, status } = req.query;
    const result = await clientService.getAllClients({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as string,
    });
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: client,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await clientService.deleteClient(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new ClientController();
