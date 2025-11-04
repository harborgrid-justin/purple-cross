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
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const staff = await staffService.createStaff(body);
    return staff;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const staff = await staffService.getStaffById(id);
    return staff;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, role, status, search } = query;
    const result = await staffService.getAllStaff({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      role: role as string,
      status: status as string,
      search: search as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const staff = await staffService.updateStaff(id, body);
    return staff;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await staffService.deleteStaff(id);
    return;
  }
}