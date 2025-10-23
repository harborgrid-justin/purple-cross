import { prisma } from '../config/database';
import { PAGINATION, QUERY_LIMITS } from '../constants';

export class PolicyService {
  async createPolicy(data: {
    title: string;
    category: string;
    content: string;
    version: string;
    effectiveDate: Date;
    reviewDate?: Date;
  }) {
    return prisma.policy.create({
      data: { ...data, status: 'active' },
    });
  }

  async getPolicy(id: string) {
    return prisma.policy.findUnique({
      where: { id },
      include: {
        acknowledgments: { orderBy: { acknowledgedAt: 'desc' }, take: QUERY_LIMITS.RECENT_ITEMS },
      },
    });
  }

  async listPolicies(filters?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      prisma.policy.findMany({ where, skip, take: limit, orderBy: { effectiveDate: 'desc' } }),
      prisma.policy.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async acknowledgePolicy(policyId: string, userId: string, ipAddress?: string) {
    return prisma.policyAcknowledgment.create({
      data: { policyId, userId, ipAddress },
    });
  }

  async getUserAcknowledgments(userId: string) {
    return prisma.policyAcknowledgment.findMany({
      where: { userId },
      include: { policy: true },
      orderBy: { acknowledgedAt: 'desc' },
    });
  }

  async updatePolicy(id: string, data: Record<string, unknown>) {
    return prisma.policy.update({ where: { id }, data });
  }

  async deletePolicy(id: string) {
    return prisma.policy.delete({ where: { id } });
  }
}

export default new PolicyService();
