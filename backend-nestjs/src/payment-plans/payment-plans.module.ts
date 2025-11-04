import { Module } from '@nestjs/common';
import { PaymentPlansController } from './payment-plans.controller';
import { PaymentPlanService } from './payment-plans.service';

@Module({
  controllers: [PaymentPlansController],
  providers: [PaymentPlanService],
  exports: [PaymentPlanService],
})
export class PaymentPlansModule {}
