import { Request, Response } from 'express';
import policyService from '../services/policy.service';
import { HTTP_STATUS } from '../constants';

export class PolicyController {
  async create(req: Request, res: Response): Promise<void> {
    const policy = await policyService.createPolicy(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: policy });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const policy = await policyService.getPolicy(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: policy });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { category, status, page, limit } = req.query;
    const result = await policyService.listPolicies({
      category: category as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async acknowledge(req: Request, res: Response): Promise<void> {
    const { userId, ipAddress } = req.body;
    const ack = await policyService.acknowledgePolicy(req.params.id, userId, ipAddress);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: ack });
  }

  async getUserAcknowledgments(req: Request, res: Response): Promise<void> {
    const acks = await policyService.getUserAcknowledgments(req.params.userId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: acks });
  }

  async update(req: Request, res: Response): Promise<void> {
    const policy = await policyService.updatePolicy(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: policy });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await policyService.deletePolicy(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new PolicyController();
