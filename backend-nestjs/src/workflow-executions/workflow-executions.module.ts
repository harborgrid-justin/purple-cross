import { Module } from '@nestjs/common';
import { WorkflowExecutionsController } from './workflow-executions.controller';
import { WorkflowExecutionService } from './workflow-executions.service';

@Module({
  controllers: [WorkflowExecutionsController],
  providers: [WorkflowExecutionService],
  exports: [WorkflowExecutionService],
})
export class WorkflowExecutionsModule {}
