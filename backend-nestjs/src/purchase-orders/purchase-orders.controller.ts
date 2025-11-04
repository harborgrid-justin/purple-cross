import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase-orders.service';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrderService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const po = await purchaseOrderService.createPurchaseOrder(body);
    return po ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const po = await purchaseOrderService.getPurchaseOrder(id);
    return po ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { status, vendor, page, limit } = query;
    const result = await purchaseOrderService.listPurchaseOrders({
      status: status as string,
      vendor: vendor as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async approve(req: Request, res: Response) {
    const { approvedBy } = body;
    const po = await purchaseOrderService.approvePurchaseOrder(id, approvedBy);
    return po ;
  }

  async receiveItems(req: Request, res: Response) {
    const { itemReceipts } = body;
    const po = await purchaseOrderService.receiveItems(id, itemReceipts);
    return po ;
  }

  async cancel(req: Request, res: Response) {
    const po = await purchaseOrderService.cancelPurchaseOrder(id);
    return po ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const po = await purchaseOrderService.updatePurchaseOrder(id, body);
    return po ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await purchaseOrderService.deletePurchaseOrder(id);
    return;
  }
}