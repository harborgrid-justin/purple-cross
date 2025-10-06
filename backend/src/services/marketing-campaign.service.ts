import { PrismaClient } from '@prisma/client';
import { PAGINATION, SORT_ORDER, FIELDS } from '../constants';

const prisma = new PrismaClient();

export class MarketingCampaignService {
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
    return prisma.marketingCampaign.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  async getCampaign(id: string) {
    return prisma.marketingCampaign.findUnique({
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
      prisma.marketingCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      prisma.marketingCampaign.count({ where }),
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
    return prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'active',
      },
    });
  }

  async updateCampaignMetrics(id: string, metrics: any) {
    return prisma.marketingCampaign.update({
      where: { id },
      data: {
        metrics,
      },
    });
  }

  async completeCampaign(id: string) {
    return prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'completed',
      },
    });
  }

  async updateCampaign(id: string, data: Record<string, unknown>) {
    return prisma.marketingCampaign.update({ where: { id }, data });
  }

  async deleteCampaign(id: string) {
    return prisma.marketingCampaign.delete({
      where: { id },
    });
  }
}

export default new MarketingCampaignService();
