import { Request, Response } from 'express';
import loyaltyProgramService from '../services/loyaltyProgram.service';

export class LoyaltyProgramController {
  async create(req: Request, res: Response) {
    const { clientId } = req.body;
    const program = await loyaltyProgramService.createProgram(clientId);
    res.status(201).json({ status: 'success', data: program });
  }

  async getById(req: Request, res: Response) {
    const program = await loyaltyProgramService.getProgram(req.params.id);
    res.status(200).json({ status: 'success', data: program });
  }

  async getByClient(req: Request, res: Response) {
    const program = await loyaltyProgramService.getProgramByClient(req.params.clientId);
    res.status(200).json({ status: 'success', data: program });
  }

  async addPoints(req: Request, res: Response) {
    const { clientId, points, description, relatedType, relatedId } = req.body;
    const program = await loyaltyProgramService.addPoints(clientId, points, description, relatedType, relatedId);
    res.status(200).json({ status: 'success', data: program });
  }

  async redeemPoints(req: Request, res: Response) {
    const { clientId, points, description } = req.body;
    const program = await loyaltyProgramService.redeemPoints(clientId, points, description);
    res.status(200).json({ status: 'success', data: program });
  }

  async getTransactions(req: Request, res: Response) {
    const { page, limit } = req.query;
    const result = await loyaltyProgramService.getTransactions(
      req.params.loyaltyProgramId,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    res.status(200).json({ status: 'success', ...result });
  }
}

export default new LoyaltyProgramController();
