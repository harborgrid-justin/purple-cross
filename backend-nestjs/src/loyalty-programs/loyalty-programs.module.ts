import { Module } from '@nestjs/common';
import { LoyaltyProgramsController } from './loyalty-programs.controller';
import { LoyaltyProgramService } from './loyalty-programs.service';

@Module({
  controllers: [LoyaltyProgramsController],
  providers: [LoyaltyProgramService],
  exports: [LoyaltyProgramService],
})
export class LoyaltyProgramsModule {}
