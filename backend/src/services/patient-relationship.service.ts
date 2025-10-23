import { prisma } from '../config/database';
import { SORT_ORDER, FIELDS } from '../constants';


export class PatientRelationshipService {
  async createRelationship(data: {
    patientId: string;
    relatedPatientId: string;
    relationshipType: string;
    notes?: string;
  }) {
    return prisma.patientRelationship.create({
      data,
    });
  }

  async getRelationship(id: string) {
    return prisma.patientRelationship.findUnique({
      where: { id },
    });
  }

  async getPatientRelationships(patientId: string) {
    return prisma.patientRelationship.findMany({
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
    return prisma.patientRelationship.update({
      where: { id },
      data,
    });
  }

  async deleteRelationship(id: string) {
    return prisma.patientRelationship.delete({
      where: { id },
    });
  }
}

export default new PatientRelationshipService();
