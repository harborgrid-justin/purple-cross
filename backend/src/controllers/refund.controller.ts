import { Request, Response } from 'express';
import refundService from '../services/refund.service';

export class RefundController {
  async create(req: Request, res: Response) {
    const refund = await refundService.createRefund(req.body);
    res.status(201).json({ status: 'success', data: refund });
  }

  async getById(req: Request, res: Response) {
    const refund = await refundService.getRefund(req.params.id);
    res.status(200).json({ status: 'success', data: refund });
  }

  async getAll(req: Request, res: Response) {
    const result = await refundService.listRefunds(req.query);
    res.status(200).json({ status: 'success', ...result });
  }

  async process(req: Request, res: Response) {
    const refund = await refundService.processRefund(req.params.id);
    res.status(200).json({ status: 'success', data: refund });
  }
}

export default new RefundController();
