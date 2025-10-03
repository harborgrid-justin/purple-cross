import { Request, Response } from 'express';
import policyService from '../services/policy.service';

export class PolicyController {
  async create(req: Request, res: Response) {
    const policy = await policyService.createPolicy(req.body);
    res.status(201).json({ status: 'success', data: policy });
  }

  async getById(req: Request, res: Response) {
    const policy = await policyService.getPolicy(req.params.id);
    res.status(200).json({ status: 'success', data: policy });
  }

  async getAll(req: Request, res: Response) {
    const { category, status, page, limit } = req.query;
    const result = await policyService.listPolicies({
      category: category as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async acknowledge(req: Request, res: Response) {
    const { userId, ipAddress } = req.body;
    const ack = await policyService.acknowledgePolicy(req.params.id, userId, ipAddress);
    res.status(201).json({ status: 'success', data: ack });
  }

  async getUserAcknowledgments(req: Request, res: Response) {
    const acks = await policyService.getUserAcknowledgments(req.params.userId);
    res.status(200).json({ status: 'success', data: acks });
  }

  async update(req: Request, res: Response) {
    const policy = await policyService.updatePolicy(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: policy });
  }
}

export default new PolicyController();
