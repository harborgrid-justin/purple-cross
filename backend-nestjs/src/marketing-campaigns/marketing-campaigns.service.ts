import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MarketingCampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createCampaign(data: {
    name: string;
    description?: string;
    campaignType: string;
    channel: string[];
    targetSegment?: any;
    startDate: Date;
    endDate?: Date;
    content: any;
  }) {
    return this.prisma.marketingCampaign.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  async getCampaign(id: string) {
    return this.prisma.marketingCampaign.findUnique({
      where: { id },
    });
  }

  async listCampaigns(filters?: {
    status?: string;
    campaignType?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      status,
      campaignType,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (campaignType) where.campaignType = campaignType;

    const [items, total] = await Promise.all([
      this.prisma.marketingCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.marketingCampaign.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async launchCampaign(id: string) {
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'active',
      },
    });
  }

  async updateCampaignMetrics(id: string, metrics: any) {
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        metrics,
      },
    });
  }

  async completeCampaign(id: string) {
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'completed',
      },
    });
  }

  async updateCampaign(id: string, data: any) {
    return this.prisma.marketingCampaign.update({ where: { id }, data });
  }

  async deleteCampaign(id: string) {
    return this.prisma.marketingCampaign.delete({
      where: { id },
    });
  }
}