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
import { DocumentTemplateService } from './document-templates.service';

@Controller('document-templates')
export class DocumentTemplatesController {
  constructor(private readonly documentTemplatesService: DocumentTemplateService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const template = await this.documentTemplatesService.createTemplate(body);
    return template ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const template = await this.documentTemplatesService.getTemplate(id);
    return template ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, page, limit } = query;
    const result = await this.documentTemplatesService.listTemplates({
      category: category as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Get(':id/incrementusage')
  async incrementUsage(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const template = await this.documentTemplatesService.incrementUsage(id);
    return template ;
  }

  @Get(':id/signdocument')
  async signDocument(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const signature = await this.documentTemplatesService.signDocument(body);
    return signature ;
  }

  @Get('document/:documentId/signatures')
  async getDocumentSignatures(@Param('documentId', ParseUUIDPipe) documentId: string) {
    const signatures = await this.documentTemplatesService.getDocumentSignatures(documentId);
    return signatures;
  }

  @Post()
  async createWorkflow(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const workflow = await this.documentTemplatesService.createWorkflow(body);
    return workflow ;
  }

  @Post('workflow/:workflowId/advance')
  async advanceWorkflow(@Param('workflowId', ParseUUIDPipe) workflowId: string) {
    const workflow = await this.documentTemplatesService.advanceWorkflow(workflowId);
    return workflow;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const template = await this.documentTemplatesService.updateTemplate(id, body);
    return template ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.documentTemplatesService.deleteTemplate(id);
    return;
  }
}