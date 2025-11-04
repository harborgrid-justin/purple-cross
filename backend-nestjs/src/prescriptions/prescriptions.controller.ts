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
import { PrescriptionService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const prescription = await prescriptionService.createPrescription(body);
    return prescription;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const prescription = await prescriptionService.getPrescriptionById(id);
    return prescription;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { page, limit, patientId, prescribedById, status } = query;
    const result = await prescriptionService.getAllPrescriptions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      patientId: patientId as string,
      prescribedById: prescribedById as string,
      status: status as string,
    });
    return result;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const prescription = await prescriptionService.updatePrescription(id, body);
    return prescription;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await prescriptionService.deletePrescription(id);
    return;
  }
}