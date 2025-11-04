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
    const template = await documentTemplateService.createTemplate(body);
    return template ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const template = await documentTemplateService.getTemplate(id);
    return template ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, page, limit } = query;
    const result = await documentTemplateService.listTemplates({
      category: category as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async incrementUsage(req: Request, res: Response) {
    const template = await documentTemplateService.incrementUsage(id);
    return template ;
  }

  async signDocument(req: Request, res: Response) {
    const signature = await documentTemplateService.signDocument(body);
    return signature ;
  }

  async getDocumentSignatures(req: Request, res: Response) {
    const signatures = await documentTemplateService.getDocumentSignatures(FIXME_documentId);
    return signatures ;
  }

  async createWorkflow(req: Request, res: Response) {
    const workflow = await documentTemplateService.createWorkflow(body);
    return workflow ;
  }

  async advanceWorkflow(req: Request, res: Response) {
    const workflow = await documentTemplateService.advanceWorkflow(FIXME_workflowId);
    return workflow ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const template = await documentTemplateService.updateTemplate(id, body);
    return template ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await documentTemplateService.deleteTemplate(id);
    return;
  }
}