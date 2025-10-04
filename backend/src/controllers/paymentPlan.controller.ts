import { Request, Response } from 'express';
import paymentPlanService from '../services/paymentPlan.service';

export class PaymentPlanController {
  async create(req: Request, res: Response) {
    const plan = await paymentPlanService.createPaymentPlan(req.body);
    res.status(201).json({ status: 'success', data: plan });
  }

  async getById(req: Request, res: Response) {
    const plan = await paymentPlanService.getPaymentPlan(req.params.id);
    res.status(200).json({ status: 'success', data: plan });
  }

  async getAll(req: Request, res: Response) {
    const { clientId, status, page, limit } = req.query;
    const result = await paymentPlanService.listPaymentPlans({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async recordPayment(req: Request, res: Response) {
    const { installmentId, amount } = req.body;
    const plan = await paymentPlanService.recordPayment(installmentId, amount);
    res.status(200).json({ status: 'success', data: plan });
  }

  async getDueInstallments(req: Request, res: Response) {
    const installments = await paymentPlanService.getDueInstallments(req.params.clientId);
    res.status(200).json({ status: 'success', data: installments });
  }

  async cancel(req: Request, res: Response) {
    const plan = await paymentPlanService.cancelPaymentPlan(req.params.id);
    res.status(200).json({ status: 'success', data: plan });
  }

  async update(req: Request, res: Response) {
    const plan = await paymentPlanService.updatePaymentPlan(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: plan });
  }

  async delete(req: Request, res: Response) {
    await paymentPlanService.deletePaymentPlan(req.params.id);
    res.status(204).send();
  }
}

export default new PaymentPlanController();
