import { Request, Response } from 'express';
import paymentPlanService from '../services/payment-plan.service';
import { HTTP_STATUS } from '../constants';

export class PaymentPlanController {
  async create(req: Request, res: Response): Promise<void> {
    const plan = await paymentPlanService.createPaymentPlan(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: plan });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const plan = await paymentPlanService.getPaymentPlan(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: plan });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { clientId, status, page, limit } = req.query;
    const result = await paymentPlanService.listPaymentPlans({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async recordPayment(req: Request, res: Response): Promise<void> {
    const { installmentId, amount } = req.body;
    const plan = await paymentPlanService.recordPayment(installmentId, amount);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: plan });
  }

  async getDueInstallments(req: Request, res: Response): Promise<void> {
    const installments = await paymentPlanService.getDueInstallments(req.params.clientId);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: installments });
  }

  async cancel(req: Request, res: Response): Promise<void> {
    const plan = await paymentPlanService.cancelPaymentPlan(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: plan });
  }

  async update(req: Request, res: Response): Promise<void> {
    const plan = await paymentPlanService.updatePaymentPlan(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: plan });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await paymentPlanService.deletePaymentPlan(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new PaymentPlanController();
