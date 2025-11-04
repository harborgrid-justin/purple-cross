import { Module } from '@nestjs/common';
import { ReportTemplatesController } from './report-templates.controller';
import { ReportTemplateService } from './report-templates.service';

@Module({
  controllers: [ReportTemplatesController],
  providers: [ReportTemplateService],
  exports: [ReportTemplateService],
})
export class ReportTemplatesModule {}
