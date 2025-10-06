import { Request, Response } from 'express';
import refundService from '../services/refund.service';
import { HTTP_STATUS } from '../constants';

export class RefundController {
  async create(req: Request, res: Response): Promise<void> {
    const refund = await refundService.createRefund(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: refund });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const refund = await refundService.getRefund(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: refund });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const result = await refundService.listRefunds(req.query);
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async process(req: Request, res: Response): Promise<void> {
    const refund = await refundService.processRefund(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: refund });
  }

  async update(req: Request, res: Response): Promise<void> {
    const refund = await refundService.updateRefund(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: refund });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await refundService.deleteRefund(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new RefundController();
