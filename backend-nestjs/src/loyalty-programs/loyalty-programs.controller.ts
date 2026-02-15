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
import { LoyaltyProgramService } from './loyalty-programs.service';

@Controller('loyalty-programs')
export class LoyaltyProgramsController {
  constructor(private readonly loyaltyProgramsService: LoyaltyProgramService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const { clientId } = body;
    const program = await this.loyaltyProgramsService.createProgram(clientId);
    return program ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const program = await this.loyaltyProgramsService.getProgram(id);
    return program ;
  }

  @Get('client/:clientId')
  async getByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    const program = await this.loyaltyProgramsService.getProgramByClient(clientId);
    return program;
  }

  @Post()
  async addPoints(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { clientId, points, description, relatedType, relatedId } = body;
    const program = await this.loyaltyProgramsService.addPoints(
      clientId,
      points,
      description,
      relatedType,
      relatedId
    );
    return program ;
  }

  @Get(':id/redeempoints')
  async redeemPoints(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { clientId, points, description } = body;
    const program = await this.loyaltyProgramsService.redeemPoints(clientId, points, description);
    return program ;
  }

  @Get('program/:loyaltyProgramId/transactions')
  async getTransactions(@Param('loyaltyProgramId', ParseUUIDPipe) loyaltyProgramId: string, @Query() query: any) {
    const { page, limit } = query;
    const result = await this.loyaltyProgramsService.getTransactions(
      loyaltyProgramId,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    return result;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { tier, page, limit } = query;
    const result = await this.loyaltyProgramsService.listPrograms({
      tier: tier as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const program = await this.loyaltyProgramsService.updateProgram(id, body);
    return program ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.loyaltyProgramsService.deleteProgram(id);
    return;
  }
}