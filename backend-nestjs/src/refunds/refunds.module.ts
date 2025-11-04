import { Module } from '@nestjs/common';
import { RefundsController } from './refunds.controller';
import { RefundService } from './refunds.service';

@Module({
  controllers: [RefundsController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundsModule {}
