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
import { LabTestService } from './lab-tests.service';

@Controller('lab-tests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const labTest = await this.labTestsService.createLabTest(body);
    return labTest;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const labTest = await this.labTestsService.getLabTestById(id);
    return labTest;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, patientId, orderedById, status } = query;
    const result = await this.labTestsService.getAllLabTests({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      orderedById: orderedById as string,
      status: status as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const labTest = await this.labTestsService.updateLabTest(id, body);
    return labTest;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.labTestsService.deleteLabTest(id);
    return;
  }
}