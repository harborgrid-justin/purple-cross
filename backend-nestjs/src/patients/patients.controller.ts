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
import { PatientService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const patient = await patientService.createPatient(body);
    return patient;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await patientService.getPatientById(id);
    return patient;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, search, ownerId } = query;
    const result = await patientService.getAllPatients({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      ownerId: ownerId as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const patient = await patientService.updatePatient(id, body);
    return patient;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await patientService.deletePatient(id);
    return;
  }
}