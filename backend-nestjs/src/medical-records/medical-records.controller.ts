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
import { MedicalRecordService } from './medical-records.service';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const record = await this.medicalRecordsService.createMedicalRecord(body);
    return record;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const record = await this.medicalRecordsService.getMedicalRecordById(id);
    return record;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, patientId, veterinarianId } = query;
    const result = await this.medicalRecordsService.getAllMedicalRecords({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      veterinarianId: veterinarianId as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const record = await this.medicalRecordsService.updateMedicalRecord(id, body);
    return record;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.medicalRecordsService.deleteMedicalRecord(id);
    return;
  }
}