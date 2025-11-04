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
import { ClientService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const client = await clientService.createClient(body);
    return client;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const client = await clientService.getClientById(id);
    return client;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, search, status } = query;
    const result = await clientService.getAllClients({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const client = await clientService.updateClient(id, body);
    return client;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await clientService.deleteClient(id);
    return;
  }
}