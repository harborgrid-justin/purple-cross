import { Module } from '@nestjs/common';
import { InsuranceClaimsController } from './insurance-claims.controller';
import { InsuranceClaimService } from './insurance-claims.service';

@Module({
  controllers: [InsuranceClaimsController],
  providers: [InsuranceClaimService],
  exports: [InsuranceClaimService],
})
export class InsuranceClaimsModule {}
