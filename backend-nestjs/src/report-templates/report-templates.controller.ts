import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ReportTemplateService } from './report-templates.service';

@Controller('report-templates')
export class ReportTemplatesController {
  constructor(private readonly reportTemplatesService: ReportTemplateService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const template = await reportTemplateService.createTemplate(body);
    return template ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const template = await reportTemplateService.getTemplate(id);
    return template ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { reportType, category, createdBy, isPublic, page, limit } = query;
    const result = await reportTemplateService.listTemplates({
      reportType: reportType as string,
      category: category as string,
      createdBy: createdBy as string,
      isPublic: isPublic === 'true',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async incrementUsage(req: Request, res: Response) {
    const template = await reportTemplateService.incrementUsage(id);
    return template ;
  }

  async scheduleReport(req: Request, res: Response) {
    const schedule = await reportTemplateService.scheduleReport(body);
    return schedule ;
  }

  async getScheduledReports(_req: Request, res: Response) {
    const schedules = await reportTemplateService.getScheduledReports();
    return schedules ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const template = await reportTemplateService.updateTemplate(id, body);
    return template ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await reportTemplateService.deleteTemplate(id);
    return;
  }
}