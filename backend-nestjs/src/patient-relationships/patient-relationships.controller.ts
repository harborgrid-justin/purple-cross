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
    const relationship = await patientRelationshipService.createRelationship(body);
    return relationship ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const relationship = await patientRelationshipService.getRelationship(id);
    return relationship ;
  }

  async getPatientRelationships(req: Request, res: Response) {
    const relationships = await patientRelationshipService.getPatientRelationships(
      FIXME_patientId
    );
    return relationships ;
  }

  async getPatientFamily(req: Request, res: Response) {
    const family = await patientRelationshipService.getPatientFamily(FIXME_patientId);
    return family ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const relationship = await patientRelationshipService.updateRelationship(
      id,
      body
    );
    return relationship ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await patientRelationshipService.deleteRelationship(id);
    return;
  }
}