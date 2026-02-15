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
import { PolicyService } from './policies.service';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PolicyService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const policy = await this.policiesService.createPolicy(body);
    return policy ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const policy = await this.policiesService.getPolicy(id);
    return policy ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, status, page, limit } = query;
    const result = await this.policiesService.listPolicies({
      category: category as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  @Get(':id/acknowledge')
  async acknowledge(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { userId, ipAddress } = body;
    const ack = await this.policiesService.acknowledgePolicy(id, userId, ipAddress);
    return ack ;
  }

  @Get('user/:userId/acknowledgments')
  async getUserAcknowledgments(@Param('userId', ParseUUIDPipe) userId: string) {
    const acks = await this.policiesService.getUserAcknowledgments(userId);
    return acks;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const policy = await this.policiesService.updatePolicy(id, body);
    return policy ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.policiesService.deletePolicy(id);
    return;
  }
}