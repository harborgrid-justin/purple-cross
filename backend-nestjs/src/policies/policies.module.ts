import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PolicyService } from './policies.service';

@Module({
  controllers: [PoliciesController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PoliciesModule {}
