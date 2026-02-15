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
    const feedback = await this.feedbackService.createFeedback(body);
    return feedback;
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const feedback = await this.feedbackService.getFeedback(id);
    return feedback;
  }

  @Get()
  async getAll(@Query() query: any) {
    const { clientId, feedbackType, rating, status, page, limit } = query;
    const result = await this.feedbackService.listFeedback({
      clientId: clientId as string,
      feedbackType: feedbackType as string,
      rating: rating ? parseInt(rating as string) : undefined,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    return result;
  }

  @Post(':id/review')
  async review(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { reviewedBy } = body;
    const feedback = await this.feedbackService.reviewFeedback(id, reviewedBy);
    return feedback;
  }

  @Get('nps/score')
  async getNPSScore(@Query() query: any) {
    const { startDate, endDate } = query;
    const nps = await this.feedbackService.getNPSScore(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    return nps;
  }

  @Post('surveys')
  @HttpCode(HttpStatus.CREATED)
  async createSurvey(@Body() body: any) {
    const survey = await this.feedbackService.createSurvey(body);
    return survey;
  }

  @Get('surveys/:id')
  async getSurvey(@Param('id', ParseUUIDPipe) id: string) {
    const survey = await this.feedbackService.getSurvey(id);
    return survey;
  }

  @Post('surveys/:id/publish')
  async publishSurvey(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { expiresAt } = body;
    const survey = await this.feedbackService.publishSurvey(
      id,
      expiresAt ? new Date(expiresAt) : undefined
    );
    return survey;
  }

  @Post('surveys/responses')
  @HttpCode(HttpStatus.CREATED)
  async submitSurveyResponse(@Body() body: any) {
    const response = await this.feedbackService.submitSurveyResponse(body);
    return response;
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {
    const feedback = await this.feedbackService.updateFeedback(id, body);
    return feedback;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.feedbackService.deleteFeedback(id);
  }
}
