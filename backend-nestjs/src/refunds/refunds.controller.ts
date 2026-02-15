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
import { RefundService } from './refunds.service';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const refund = await this.refundsService.createRefund(body);
    return refund ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const refund = await this.refundsService.getRefund(id);
    return refund ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const result = await this.refundsService.listRefunds(query);
    return result ;
  }

  @Get(':id/process')
  async process(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const refund = await this.refundsService.processRefund(id);
    return refund ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const refund = await this.refundsService.updateRefund(id, body);
    return refund ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.refundsService.deleteRefund(id);
    return;
  }
}