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
import { CommunicationService } from './communications.service';

@Controller('communications')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const communication = await this.communicationsService.createCommunication(body);
    return communication;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const communication = await this.communicationsService.getCommunicationById(id);
    return communication;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, clientId, type } = query;
    const result = await this.communicationsService.getAllCommunications({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      clientId: clientId as string,
      type: type as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const communication = await this.communicationsService.updateCommunication(id, body);
    return communication;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.communicationsService.deleteCommunication(id);
    return;
  }
}