import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    return prisma.clientFeedback.findUnique({
      where: { id },
    });
  }

  async listFeedback(filters?: {
    clientId?: string;
    feedbackType?: string;
    rating?: number;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { clientId, feedbackType, rating, status, page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (feedbackType) where.feedbackType = feedbackType;
    if (rating) where.rating = rating;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.clientFeedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
    const where: any = {
      npsScore: { not: null },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const feedback = await prisma.clientFeedback.findMany({
      where,
      select: { npsScore: true },
    });

    if (feedback.length === 0) return null;

    const scores = feedback.map(f => f.npsScore!);
    const promoters = scores.filter(s => s >= 9).length;
    const detractors = scores.filter(s => s <= 6).length;
    
    const npsScore = ((promoters - detractors) / scores.length) * 100;

    return {
      npsScore: Math.round(npsScore),
      totalResponses: scores.length,
      promoters,
      passives: scores.filter(s => s === 7 || s === 8).length,
      detractors,
    };
  }

  async deleteFeedback(id: string) {
    return prisma.clientFeedback.delete({
      where: { id },
    });
  }

  // Survey methods
  async createSurvey(data: {
    title: string;
    description?: string;
    questions: any;
  }) {
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

  async submitSurveyResponse(data: {
    surveyId: string;
    clientId?: string;
    answers: any;
  }) {
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
