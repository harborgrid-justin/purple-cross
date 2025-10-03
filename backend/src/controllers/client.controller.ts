import { Request, Response } from 'express';
import clientService from '../services/client.service';

export class ClientController {
  async create(req: Request, res: Response) {
    const client = await clientService.createClient(req.body);
    res.status(201).json({
      status: 'success',
      data: client,
    });
  }

  async getById(req: Request, res: Response) {
    const client = await clientService.getClientById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: client,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, search, status } = req.query;
    const result = await clientService.getAllClients({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: client,
    });
  }

  async delete(req: Request, res: Response) {
    await clientService.deleteClient(req.params.id);
    res.status(204).send();
  }
}

export default new ClientController();
