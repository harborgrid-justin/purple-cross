import { Request, Response } from 'express';
import purchaseOrderService from '../services/purchase-order.service';
import { HTTP_STATUS } from '../constants';

export class PurchaseOrderController {
  async create(req: Request, res: Response): Promise<void> {
    const po = await purchaseOrderService.createPurchaseOrder(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: po });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const po = await purchaseOrderService.getPurchaseOrder(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: po });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { status, vendor, page, limit } = req.query;
    const result = await purchaseOrderService.listPurchaseOrders({
      status: status as string,
      vendor: vendor as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async approve(req: Request, res: Response): Promise<void> {
    const { approvedBy } = req.body;
    const po = await purchaseOrderService.approvePurchaseOrder(req.params.id, approvedBy);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: po });
  }

  async receiveItems(req: Request, res: Response): Promise<void> {
    const { itemReceipts } = req.body;
    const po = await purchaseOrderService.receiveItems(req.params.id, itemReceipts);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: po });
  }

  async cancel(req: Request, res: Response): Promise<void> {
    const po = await purchaseOrderService.cancelPurchaseOrder(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: po });
  }

  async update(req: Request, res: Response): Promise<void> {
    const po = await purchaseOrderService.updatePurchaseOrder(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: po });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await purchaseOrderService.deletePurchaseOrder(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new PurchaseOrderController();
