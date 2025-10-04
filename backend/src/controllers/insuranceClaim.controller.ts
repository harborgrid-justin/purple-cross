import { Request, Response } from 'express';
import insuranceClaimService from '../services/insuranceClaim.service';

export class InsuranceClaimController {
  async create(req: Request, res: Response) {
    const claim = await insuranceClaimService.createClaim(req.body);
    res.status(201).json({ status: 'success', data: claim });
  }

  async getById(req: Request, res: Response) {
    const claim = await insuranceClaimService.getClaim(req.params.id);
    res.status(200).json({ status: 'success', data: claim });
  }

  async getAll(req: Request, res: Response) {
    const result = await insuranceClaimService.listClaims(req.query);
    res.status(200).json({ status: 'success', ...result });
  }

  async updateStatus(req: Request, res: Response) {
    const { status, ...updates } = req.body;
    const claim = await insuranceClaimService.updateClaimStatus(req.params.id, status, updates);
    res.status(200).json({ status: 'success', data: claim });
  }

  async processClaim(req: Request, res: Response) {
    const { approvedAmount, paidAmount } = req.body;
    const claim = await insuranceClaimService.processClaim(req.params.id, approvedAmount, paidAmount);
    res.status(200).json({ status: 'success', data: claim });
  }

  async update(req: Request, res: Response) {
    const claim = await insuranceClaimService.updateClaim(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: claim });
  }

  async delete(req: Request, res: Response) {
    await insuranceClaimService.deleteClaim(req.params.id);
    res.status(204).send();
  }
}

export default new InsuranceClaimController();
