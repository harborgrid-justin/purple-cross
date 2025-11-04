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
    const policy = await policyService.createPolicy(body);
    return policy ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const policy = await policyService.getPolicy(id);
    return policy ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { category, status, page, limit } = query;
    const result = await policyService.listPolicies({
      category: category as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async acknowledge(req: Request, res: Response) {
    const { userId, ipAddress } = body;
    const ack = await policyService.acknowledgePolicy(id, userId, ipAddress);
    return ack ;
  }

  async getUserAcknowledgments(req: Request, res: Response) {
    const acks = await policyService.getUserAcknowledgments(FIXME_userId);
    return acks ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const policy = await policyService.updatePolicy(id, body);
    return policy ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await policyService.deletePolicy(id);
    return;
  }
}