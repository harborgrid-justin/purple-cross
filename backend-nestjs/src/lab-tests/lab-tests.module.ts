import { Module } from '@nestjs/common';
import { LabTestsController } from './lab-tests.controller';
import { LabTestService } from './lab-tests.service';

@Module({
  controllers: [LabTestsController],
  providers: [LabTestService],
  exports: [LabTestService],
})
export class LabTestsModule {}
