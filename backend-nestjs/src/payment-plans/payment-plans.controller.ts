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
import { PaymentPlanService } from './payment-plans.service';

@Controller('payment-plans')
export class PaymentPlansController {
  constructor(private readonly paymentPlansService: PaymentPlanService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const plan = await this.paymentPlansService.createPaymentPlan(body);
    return plan ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const plan = await this.paymentPlansService.getPaymentPlan(id);
    return plan ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, status, page, limit } = query;
    const result = await this.paymentPlansService.listPaymentPlans({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Post(':id/recordpayment')
  async recordPayment(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { installmentId, amount } = body;
    const plan = await this.paymentPlansService.recordPayment(installmentId, amount);
    return plan ;
  }

  @Get('client/:clientId/due-installments')
  async getDueInstallments(@Param('clientId', ParseUUIDPipe) clientId: string) {
    const installments = await this.paymentPlansService.getDueInstallments(clientId);
    return installments;
  }

  @Post(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const plan = await this.paymentPlansService.cancelPaymentPlan(id);
    return plan ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const plan = await this.paymentPlansService.updatePaymentPlan(id, body);
    return plan ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.paymentPlansService.deletePaymentPlan(id);
    return;
  }
}