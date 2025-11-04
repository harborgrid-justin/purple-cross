import { Module } from '@nestjs/common';
import { EstimatesController } from './estimates.controller';
import { EstimateService } from './estimates.service';

@Module({
  controllers: [EstimatesController],
  providers: [EstimateService],
  exports: [EstimateService],
})
export class EstimatesModule {}
