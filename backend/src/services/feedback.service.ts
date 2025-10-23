import { prisma } from '../config/database';
import { PAGINATION, SORT_ORDER, FIELDS } from '../constants';

export class FeedbackService {
  async createFeedback(data: {
    clientId: string;
    feedbackType: string;
    rating?: number;
    comment?: string;
    relatedType?: string;
    relatedId?: string;
    npsScore?: number;
  }) {
    return prisma.clientFeedback.create({
      data: {
        ...data,
        status: 'new',
      },
    });
  }

  async getFeedback(id: string) {
    const feedback = await prisma.clientFeedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    return feedback;
  }

  async listFeedback(filters?: {
    clientId?: string;
    feedbackType?: string;
    rating?: number;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      clientId,
      feedbackType,
      rating,
      status,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = clientId;
    if (feedbackType) where.feedbackType = feedbackType;
    if (rating) where.rating = rating;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.clientFeedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      prisma.clientFeedback.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async reviewFeedback(id: string, reviewedBy: string) {
    return prisma.clientFeedback.update({
      where: { id },
      data: {
        status: 'reviewed',
        reviewedBy,
        reviewedAt: new Date(),
      },
    });
  }

  async getNPSScore(startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = {
      npsScore: { not: null },
    };

    if (startDate || endDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (where as any).createdAt = {};
      if (startDate) (where as any).createdAt.gte = startDate;
      if (endDate) (where as any).createdAt.lte = endDate;
    }

    const feedback = await prisma.clientFeedback.findMany({
      where,
      select: { npsScore: true },
    });

    if (feedback.length === 0) return null;

    const scores = feedback.map((f: any) => f.npsScore!);
    const promoters = scores.filter((s: any) => s >= 9).length;
    const detractors = scores.filter((s: any) => s <= 6).length;

    const npsScore = ((promoters - detractors) / scores.length) * 100;

    return {
      npsScore: Math.round(npsScore),
      totalResponses: scores.length,
      promoters,
      passives: scores.filter((s: any) => s === 7 || s === 8).length,
      detractors,
    };
  }

  async updateFeedback(id: string, data: Record<string, unknown>) {
    return prisma.clientFeedback.update({ where: { id }, data });
  }

  async deleteFeedback(id: string) {
    return prisma.clientFeedback.delete({
      where: { id },
    });
  }

  // Survey methods
  async createSurvey(data: { title: string; description?: string; questions: any }) {
    return prisma.survey.create({
      data: {
        ...data,
        status: 'draft',
      },
    });
  }

  async getSurvey(id: string) {
    return prisma.survey.findUnique({
      where: { id },
      include: {
        responses: {
          orderBy: { submittedAt: 'desc' },
        },
      },
    });
  }

  async publishSurvey(id: string, expiresAt?: Date) {
    return prisma.survey.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        expiresAt,
      },
    });
  }

  async submitSurveyResponse(data: { surveyId: string; clientId?: string; answers: any }) {
    return prisma.surveyResponse.create({
      data,
    });
  }

  async getSurveyResponses(surveyId: string) {
    return prisma.surveyResponse.findMany({
      where: { surveyId },
      orderBy: { submittedAt: 'desc' },
    });
  }
}

export default new FeedbackService();
