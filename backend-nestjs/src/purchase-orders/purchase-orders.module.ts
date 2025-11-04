import { Module } from '@nestjs/common';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrderService } from './purchase-orders.service';

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrdersModule {}
