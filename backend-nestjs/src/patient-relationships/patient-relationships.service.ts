import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PatientRelationshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createRelationship(data: {
    patientId: string;
    relatedPatientId: string;
    relationshipType: string;
    notes?: string;
  }) {
    return this.prisma.patientRelationship.create({
      data,
    });
  }

  async getRelationship(id: string) {
    return this.prisma.patientRelationship.findUnique({
      where: { id },
    });
  }

  async getPatientRelationships(patientId: string) {
    return this.prisma.patientRelationship.findMany({
      where: {
        OR: [{ patientId }, { relatedPatientId: patientId }],
      },
      orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
    });
  }

  async getPatientFamily(patientId: string) {
    const relationships = await this.getPatientRelationships(patientId);

    const family = {
      parents: relationships.filter(
        (r: any) => r.relationshipType === 'parent' && r.relatedPatientId === patientId
      ),
      offspring: relationships.filter(
        (r: any) => r.relationshipType === 'parent' && r.patientId === patientId
      ),
      siblings: relationships.filter((r: any) => r.relationshipType === 'sibling'),
      litter: relationships.filter((r: any) => r.relationshipType === 'litter'),
    };

    return family;
  }

  async updateRelationship(
    id: string,
    data: {
      relationshipType?: string;
      notes?: string;
    }
  ) {
    return this.prisma.patientRelationship.update({
      where: { id },
      data,
    });
  }

  async deleteRelationship(id: string) {
    return this.prisma.patientRelationship.delete({
      where: { id },
    });
  }
}