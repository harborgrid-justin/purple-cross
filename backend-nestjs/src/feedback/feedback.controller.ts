import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) body: any) {
    const feedback = await feedbackService.createFeedback(body);
    return feedback ;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const feedback = await feedbackService.getFeedback(id);
    return feedback ;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, feedbackType, rating, status, page, limit } = query;
    const result = await feedbackService.listFeedback({
      clientId: clientId as string,
      feedbackType: feedbackType as string,
      rating: rating ? parseInt(rating as string) : undefined,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result ;
  }

  async review(req: Request, res: Response) {
    const { reviewedBy } = body;
    const feedback = await feedbackService.reviewFeedback(id, reviewedBy);
    return feedback ;
  }

  async getNPSScore(req: Request, res: Response) {
    const { startDate, endDate } = query;
    const nps = await feedbackService.getNPSScore(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    return nps ;
  }

  async createSurvey(req: Request, res: Response) {
    const survey = await feedbackService.createSurvey(body);
    return survey ;
  }

  async getSurvey(req: Request, res: Response) {
    const survey = await feedbackService.getSurvey(id);
    return survey ;
  }

  async publishSurvey(req: Request, res: Response) {
    const { expiresAt } = body;
    const survey = await feedbackService.publishSurvey(
      id,
      expiresAt ? new Date(expiresAt) : undefined
    );
    return survey ;
  }

  async submitSurveyResponse(req: Request, res: Response) {
    const response = await feedbackService.submitSurveyResponse(body);
    return response ;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const feedback = await feedbackService.updateFeedback(id, body);
    return feedback ;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await feedbackService.deleteFeedback(id);
    return;
  }
}