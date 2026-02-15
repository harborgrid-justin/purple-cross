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
    const claim = await this.insuranceClaimsService.createClaim(body);
    return claim ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const claim = await this.insuranceClaimsService.getClaim(id);
    return claim ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const result = await this.insuranceClaimsService.listClaims(query);
    return result ;
  }

  @Put()
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { status, ...updates } = body;
    const claim = await this.insuranceClaimsService.updateClaimStatus(id, status, updates);
    return claim ;
  }

  @Get(':id/processclaim')
  async processClaim(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { approvedAmount, paidAmount } = body;
    const claim = await this.insuranceClaimsService.processClaim(
      id,
      approvedAmount,
      paidAmount
    );
    return claim ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const claim = await this.insuranceClaimsService.updateClaim(id, body);
    return claim ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.insuranceClaimsService.deleteClaim(id);
    return;
  }
}