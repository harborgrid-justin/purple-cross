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
import { DocumentService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const document = await documentService.createDocument(body);
    return document;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const document = await documentService.getDocumentById(id);
    return document;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, entityType, entityId, category } = query;
    const result = await documentService.getAllDocuments({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      entityType: entityType as string,
      entityId: entityId as string,
      category: category as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const document = await documentService.updateDocument(id, body);
    return document;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await documentService.deleteDocument(id);
    return;
  }
}