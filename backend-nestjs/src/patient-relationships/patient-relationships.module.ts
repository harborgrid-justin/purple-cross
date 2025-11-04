import { Module } from '@nestjs/common';
import { PatientRelationshipsController } from './patient-relationships.controller';
import { PatientRelationshipService } from './patient-relationships.service';

@Module({
  controllers: [PatientRelationshipsController],
  providers: [PatientRelationshipService],
  exports: [PatientRelationshipService],
})
export class PatientRelationshipsModule {}
