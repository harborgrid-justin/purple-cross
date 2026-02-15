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
import { InvoiceService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoiceService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const invoice = await this.invoicesService.createInvoice(body);
    return invoice;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const invoice = await this.invoicesService.getInvoiceById(id);
    return invoice;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, clientId, status } = query;
    const result = await this.invoicesService.getAllInvoices({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      clientId: clientId as string,
      status: status as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const invoice = await this.invoicesService.updateInvoice(id, body);
    return invoice;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.invoicesService.deleteInvoice(id);
    return;
  }
}