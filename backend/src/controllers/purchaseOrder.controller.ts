import { Request, Response } from 'express';
import purchaseOrderService from '../services/purchaseOrder.service';

export class PurchaseOrderController {
  async create(req: Request, res: Response) {
    const po = await purchaseOrderService.createPurchaseOrder(req.body);
    res.status(201).json({ status: 'success', data: po });
  }

  async getById(req: Request, res: Response) {
    const po = await purchaseOrderService.getPurchaseOrder(req.params.id);
    res.status(200).json({ status: 'success', data: po });
  }

  async getAll(req: Request, res: Response) {
    const { status, vendor, page, limit } = req.query;
    const result = await purchaseOrderService.listPurchaseOrders({
      status: status as string,
      vendor: vendor as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(200).json({ status: 'success', ...result });
  }

  async approve(req: Request, res: Response) {
    const { approvedBy } = req.body;
    const po = await purchaseOrderService.approvePurchaseOrder(req.params.id, approvedBy);
    res.status(200).json({ status: 'success', data: po });
  }

  async receiveItems(req: Request, res: Response) {
    const { itemReceipts } = req.body;
    const po = await purchaseOrderService.receiveItems(req.params.id, itemReceipts);
    res.status(200).json({ status: 'success', data: po });
  }

  async cancel(req: Request, res: Response) {
    const po = await purchaseOrderService.cancelPurchaseOrder(req.params.id);
    res.status(200).json({ status: 'success', data: po });
  }

  async delete(req: Request, res: Response) {
    await purchaseOrderService.deletePurchaseOrder(req.params.id);
    res.status(204).send();
  }
}

export default new PurchaseOrderController();
