import { Request, Response } from 'express';
import insuranceClaimService from '../services/insurance-claim.service';
import { HTTP_STATUS } from '../constants';

export class InsuranceClaimController {
  async create(req: Request, res: Response): Promise<void> {
    const claim = await insuranceClaimService.createClaim(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: claim });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const claim = await insuranceClaimService.getClaim(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: claim });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const result = await insuranceClaimService.listClaims(req.query);
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { status, ...updates } = req.body;
    const claim = await insuranceClaimService.updateClaimStatus(req.params.id, status, updates);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: claim });
  }

  async processClaim(req: Request, res: Response): Promise<void> {
    const { approvedAmount, paidAmount } = req.body;
    const claim = await insuranceClaimService.processClaim(
      req.params.id,
      approvedAmount,
      paidAmount
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: claim });
  }

  async update(req: Request, res: Response): Promise<void> {
    const claim = await insuranceClaimService.updateClaim(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: claim });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await insuranceClaimService.deleteClaim(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new InsuranceClaimController();
