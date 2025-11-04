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
    const refund = await refundService.createRefund(body);
    return refund ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const refund = await refundService.getRefund(id);
    return refund ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const result = await refundService.listRefunds(query);
    return result ;
  }

  async process(req: Request, res: Response) {
    const refund = await refundService.processRefund(id);
    return refund ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const refund = await refundService.updateRefund(id, body);
    return refund ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await refundService.deleteRefund(id);
    return;
  }
}