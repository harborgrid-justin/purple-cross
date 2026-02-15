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
import { EstimateService } from './estimates.service';

@Controller('estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimateService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const estimate = await this.estimatesService.createEstimate(body);
    return estimate ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const estimate = await this.estimatesService.getEstimate(id);
    return estimate ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, status, page, limit } = query;
    const result = await this.estimatesService.listEstimates({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Post(':id/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const estimate = await this.estimatesService.approveEstimate(id);
    return estimate ;
  }

  @Get(':id/converttoinvoice')
  async convertToInvoice(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const invoice = await this.estimatesService.convertToInvoice(id);
    return invoice ;
  }

  @Post(':id/reject')
  async reject(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const estimate = await this.estimatesService.rejectEstimate(id);
    return estimate ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const estimate = await this.estimatesService.updateEstimate(id, body);
    return estimate ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.estimatesService.deleteEstimate(id);
    return;
  }
}