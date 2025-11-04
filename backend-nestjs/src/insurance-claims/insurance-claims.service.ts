import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InsuranceClaimService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
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
    return this.prisma.insuranceClaim.create({
      data: { ...data, claimNumber, status: 'submitted' },
    });
  }

  private async generateClaimNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.insuranceClaim.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } },
    });
    return `CLM-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async getClaim(id: string) {
    return this.prisma.insuranceClaim.findUnique({ where: { id } });
  }

  async listClaims(filters?: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtersAny = (filters as any) || {};
    const { status, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = filtersAny;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      this.prisma.insuranceClaim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.insuranceClaim.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateClaimStatus(id: string, status: string, updates?: any) {
    return this.prisma.insuranceClaim.update({ where: { id }, data: { status, ...updates } });
  }

  async processClaim(id: string, approvedAmount: number, paidAmount: number) {
    return this.prisma.insuranceClaim.update({
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
    return this.prisma.insuranceClaim.update({ where: { id }, data });
  }

  async deleteClaim(id: string) {
    return this.prisma.insuranceClaim.delete({ where: { id } });
  }
}