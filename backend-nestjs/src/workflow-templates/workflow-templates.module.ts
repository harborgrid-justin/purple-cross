import { Module } from '@nestjs/common';
import { WorkflowTemplatesController } from './workflow-templates.controller';
import { WorkflowTemplateService } from './workflow-templates.service';

@Module({
  controllers: [WorkflowTemplatesController],
  providers: [WorkflowTemplateService],
  exports: [WorkflowTemplateService],
})
export class WorkflowTemplatesModule {}
