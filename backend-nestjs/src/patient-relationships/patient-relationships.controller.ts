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
import { PatientRelationshipService } from './patient-relationships.service';

@Controller('patient-relationships')
export class PatientRelationshipsController {
  constructor(private readonly patientRelationshipsService: PatientRelationshipService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const relationship = await this.patientRelationshipsService.createRelationship(body);
    return relationship ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const relationship = await this.patientRelationshipsService.getRelationship(id);
    return relationship ;
  }

  @Get('patient/:patientId/relationships')
  async getPatientRelationships(@Param('patientId', ParseUUIDPipe) patientId: string) {
    const relationships = await this.patientRelationshipsService.getPatientRelationships(
      patientId
    );
    return relationships ;
  }

  @Get('patient/:patientId/family')
  async getPatientFamily(@Param('patientId', ParseUUIDPipe) patientId: string) {
    const family = await this.patientRelationshipsService.getPatientFamily(patientId);
    return family ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const relationship = await this.patientRelationshipsService.updateRelationship(
      id,
      body
    );
    return relationship ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.patientRelationshipsService.deleteRelationship(id);
    return;
  }
}