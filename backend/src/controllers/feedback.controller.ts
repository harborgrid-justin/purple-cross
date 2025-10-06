import { Request, Response } from 'express';
import feedbackService from '../services/feedback.service';
import { HTTP_STATUS } from '../constants';

export class FeedbackController {
  async create(req: Request, res: Response): Promise<void> {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: feedback });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const feedback = await feedbackService.getFeedback(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: feedback });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { clientId, feedbackType, rating, status, page, limit } = req.query;
    const result = await feedbackService.listFeedback({
      clientId: clientId as string,
      feedbackType: feedbackType as string,
      rating: rating ? parseInt(rating as string) : undefined,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.status(HTTP_STATUS.OK).json({ status: 'success', ...result });
  }

  async review(req: Request, res: Response): Promise<void> {
    const { reviewedBy } = req.body;
    const feedback = await feedbackService.reviewFeedback(req.params.id, reviewedBy);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: feedback });
  }

  async getNPSScore(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = req.query;
    const nps = await feedbackService.getNPSScore(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: nps });
  }

  async createSurvey(req: Request, res: Response): Promise<void> {
    const survey = await feedbackService.createSurvey(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: survey });
  }

  async getSurvey(req: Request, res: Response): Promise<void> {
    const survey = await feedbackService.getSurvey(req.params.id);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: survey });
  }

  async publishSurvey(req: Request, res: Response): Promise<void> {
    const { expiresAt } = req.body;
    const survey = await feedbackService.publishSurvey(
      req.params.id,
      expiresAt ? new Date(expiresAt) : undefined
    );
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: survey });
  }

  async submitSurveyResponse(req: Request, res: Response): Promise<void> {
    const response = await feedbackService.submitSurveyResponse(req.body);
    res.status(HTTP_STATUS.CREATED).json({ status: 'success', data: response });
  }

  async update(req: Request, res: Response): Promise<void> {
    const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({ status: 'success', data: feedback });
  }

  async delete(req: Request, res: Response): Promise<void> {
    await feedbackService.deleteFeedback(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export default new FeedbackController();
