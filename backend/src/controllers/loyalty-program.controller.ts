import { Request, Response } from 'express';
import loyaltyProgramService from '../services/loyalty-program.service';
import { HTTP_STATUS } from '../constants';

export class LoyaltyProgramController {
  async create(req: Request, res: Response): Promise<void> {
    const { clientId } = req.body;
    const program = await loyaltyProgramService.createProgram(clientId);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: program });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const program = await loyaltyProgramService.getProgram(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: program });
  }

  async getByClient(req: Request, res: Response): Promise<void> {
    const program = await loyaltyProgramService.getProgramByClient(req.params.clientId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: program });
  }

  async addPoints(req: Request, res: Response): Promise<void> {
    const { clientId, points, description, relatedType, relatedId } = req.body;
    const program = await loyaltyProgramService.addPoints(
      clientId,
      points,
      description,
      relatedType,
      relatedId
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: program });
  }

  async redeemPoints(req: Request, res: Response): Promise<void> {
    const { clientId, points, description } = req.body;
    const program = await loyaltyProgramService.redeemPoints(clientId, points, description);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: program });
  }

  async getTransactions(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query;
    const result = await loyaltyProgramService.getTransactions(
      req.params.loyaltyProgramId,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { tier, page, limit } = req.query;
    const result = await loyaltyProgramService.listPrograms({
      tier: tier as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async update(req: Request, res: Response): Promise<void> {
    const program = await loyaltyProgramService.updateProgram(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: program });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await loyaltyProgramService.deleteProgram(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new LoyaltyProgramController();
