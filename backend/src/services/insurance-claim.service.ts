import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InsuranceClaimService {
  async createClaim(data: {
    patientId: string;
    clientId: string;
    insuranceProvider: string;
    policyNumber: string;
    serviceDate: Date;
    diagnosisCodes: string[];
    procedureCodes: string[];
    claimAmount: number;
  }) {
    const claimNumber = await this.generateClaimNumber();
    return prisma.insuranceClaim.create({
      data: { ...data, claimNumber, status: 'submitted' },
    });
  }

  private async generateClaimNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.insuranceClaim.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } },
    });
    return `CLM-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getClaim(id: string) {
    return prisma.insuranceClaim.findUnique({ where: { id } });
  }

  async listClaims(filters?: any) {
    const { status, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      prisma.insuranceClaim.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.insuranceClaim.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateClaimStatus(id: string, status: string, updates?: any) {
    return prisma.insuranceClaim.update({ where: { id }, data: { status, ...updates } });
  }

  async processClaim(id: string, approvedAmount: number, paidAmount: number) {
    return prisma.insuranceClaim.update({
      where: { id },
      data: {
        status: 'paid',
        approvedAmount,
        paidAmount,
        processedDate: new Date(),
        paidDate: new Date(),
      },
    });
  }

  async updateClaim(id: string, data: any) {
    return prisma.insuranceClaim.update({ where: { id }, data });
  }

  async deleteClaim(id: string) {
    return prisma.insuranceClaim.delete({ where: { id } });
  }
}

export default new InsuranceClaimService();
