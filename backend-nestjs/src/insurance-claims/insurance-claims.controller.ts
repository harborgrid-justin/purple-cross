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
import { InsuranceClaimService } from './insurance-claims.service';

@Controller('insurance-claims')
export class InsuranceClaimsController {
  constructor(private readonly insuranceClaimsService: InsuranceClaimService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const claim = await insuranceClaimService.createClaim(body);
    return claim ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const claim = await insuranceClaimService.getClaim(id);
    return claim ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const result = await insuranceClaimService.listClaims(query);
    return result ;
  }

  async updateStatus(req: Request, res: Response) {
    const { status, ...updates } = body;
    const claim = await insuranceClaimService.updateClaimStatus(id, status, updates);
    return claim ;
  }

  async processClaim(req: Request, res: Response) {
    const { approvedAmount, paidAmount } = body;
    const claim = await insuranceClaimService.processClaim(
      id,
      approvedAmount,
      paidAmount
    );
    return claim ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const claim = await insuranceClaimService.updateClaim(id, body);
    return claim ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await insuranceClaimService.deleteClaim(id);
    return;
  }
}