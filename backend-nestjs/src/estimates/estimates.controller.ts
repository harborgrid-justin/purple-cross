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
    const estimate = await estimateService.createEstimate(body);
    return estimate ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const estimate = await estimateService.getEstimate(id);
    return estimate ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, status, page, limit } = query;
    const result = await estimateService.listEstimates({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async approve(req: Request, res: Response) {
    const estimate = await estimateService.approveEstimate(id);
    return estimate ;
  }

  async convertToInvoice(req: Request, res: Response) {
    const invoice = await estimateService.convertToInvoice(id);
    return invoice ;
  }

  async reject(req: Request, res: Response) {
    const estimate = await estimateService.rejectEstimate(id);
    return estimate ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const estimate = await estimateService.updateEstimate(id, body);
    return estimate ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await estimateService.deleteEstimate(id);
    return;
  }
}