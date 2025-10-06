import { Request, Response } from 'express';
import estimateService from '../services/estimate.service';
import { HTTP_STATUS } from '../constants';

export class EstimateController {
  async create(req: Request, res: Response): Promise<void> {
    const estimate = await estimateService.createEstimate(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: estimate });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const estimate = await estimateService.getEstimate(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: estimate });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { clientId, status, page, limit } = req.query;
    const result = await estimateService.listEstimates({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async approve(req: Request, res: Response): Promise<void> {
    const estimate = await estimateService.approveEstimate(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: estimate });
  }

  async convertToInvoice(req: Request, res: Response): Promise<void> {
    const invoice = await estimateService.convertToInvoice(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: invoice });
  }

  async reject(req: Request, res: Response): Promise<void> {
    const estimate = await estimateService.rejectEstimate(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: estimate });
  }

  async update(req: Request, res: Response): Promise<void> {
    const estimate = await estimateService.updateEstimate(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: estimate });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await estimateService.deleteEstimate(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new EstimateController();
