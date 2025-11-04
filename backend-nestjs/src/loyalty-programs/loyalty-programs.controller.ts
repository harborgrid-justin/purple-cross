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
    const program = await loyaltyProgramService.createProgram(clientId);
    return program ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const program = await loyaltyProgramService.getProgram(id);
    return program ;
  }

  async getByClient(req: Request, res: Response) {
    const program = await loyaltyProgramService.getProgramByClient(req.params.clientId);
    return program ;
  }

  async addPoints(req: Request, res: Response) {
    const { clientId, points, description, relatedType, relatedId } = body;
    const program = await loyaltyProgramService.addPoints(
      clientId,
      points,
      description,
      relatedType,
      relatedId
    );
    return program ;
  }

  async redeemPoints(req: Request, res: Response) {
    const { clientId, points, description } = body;
    const program = await loyaltyProgramService.redeemPoints(clientId, points, description);
    return program ;
  }

  async getTransactions(req: Request, res: Response) {
    const { page, limit } = query;
    const result = await loyaltyProgramService.getTransactions(
      req.params.loyaltyProgramId,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    return result ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { tier, page, limit } = query;
    const result = await loyaltyProgramService.listPrograms({
      tier: tier as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const program = await loyaltyProgramService.updateProgram(id, body);
    return program ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await loyaltyProgramService.deleteProgram(id);
    return;
  }
}