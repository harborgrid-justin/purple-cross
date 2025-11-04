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
    const plan = await paymentPlanService.createPaymentPlan(body);
    return plan ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const plan = await paymentPlanService.getPaymentPlan(id);
    return plan ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, status, page, limit } = query;
    const result = await paymentPlanService.listPaymentPlans({
      clientId: clientId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async recordPayment(req: Request, res: Response) {
    const { installmentId, amount } = body;
    const plan = await paymentPlanService.recordPayment(installmentId, amount);
    return plan ;
  }

  async getDueInstallments(req: Request, res: Response) {
    const installments = await paymentPlanService.getDueInstallments(req.params.clientId);
    return installments ;
  }

  async cancel(req: Request, res: Response) {
    const plan = await paymentPlanService.cancelPaymentPlan(id);
    return plan ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const plan = await paymentPlanService.updatePaymentPlan(id, body);
    return plan ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await paymentPlanService.deletePaymentPlan(id);
    return;
  }
}