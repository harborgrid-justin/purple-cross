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
    const po = await this.purchaseOrdersService.createPurchaseOrder(body);
    return po ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const po = await this.purchaseOrdersService.getPurchaseOrder(id);
    return po ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { status, vendor, page, limit } = query;
    const result = await this.purchaseOrdersService.listPurchaseOrders({
      status: status as string,
      vendor: vendor as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Post(':id/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { approvedBy } = body;
    const po = await this.purchaseOrdersService.approvePurchaseOrder(id, approvedBy);
    return po ;
  }

  @Get(':id/receiveitems')
  async receiveItems(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { itemReceipts } = body;
    const po = await this.purchaseOrdersService.receiveItems(id, itemReceipts);
    return po ;
  }

  @Post(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const po = await this.purchaseOrdersService.cancelPurchaseOrder(id);
    return po ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const po = await this.purchaseOrdersService.updatePurchaseOrder(id, body);
    return po ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.purchaseOrdersService.deletePurchaseOrder(id);
    return;
  }
}