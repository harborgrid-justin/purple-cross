import { Request, Response } from 'express';
import invoiceService from '../services/invoice.service';

export class InvoiceController {
  async create(req: Request, res: Response) {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({
      status: 'success',
      data: invoice,
    });
  }

  async getById(req: Request, res: Response) {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: invoice,
    });
  }

  async getAll(req: Request, res: Response) {
    const { page, limit, clientId, status } = req.query;
    const result = await invoiceService.getAllInvoices({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      clientId: clientId as string,
      status: status as string,
    });
    res.status(200).json({
      status: 'success',
      ...result,
    });
  }

  async update(req: Request, res: Response) {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: invoice,
    });
  }

  async delete(req: Request, res: Response) {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(204).send();
  }
}

export default new InvoiceController();
