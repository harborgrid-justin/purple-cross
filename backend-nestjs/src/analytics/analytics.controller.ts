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
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  async getDashboardStats(_req: Request, res: Response) {
    const stats = await analyticsService.getDashboardStats();
    return stats;
  }

  async getPatientDemographics(_req: Request, res: Response) {
    const demographics = await analyticsService.getPatientDemographics();
    return demographics;
  }

  async getAppointmentAnalytics(req: Request, res: Response) {
    const { startDate, endDate } = query;
    const analytics = await analyticsService.getAppointmentAnalytics(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    return analytics;
  }

  async getFinancialReport(req: Request, res: Response) {
    const { startDate, endDate } = query;
    const report = await analyticsService.getFinancialReport(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    return report;
  }

  async getInventoryReport(_req: Request, res: Response) {
    const report = await analyticsService.getInventoryReport();
    return report;
  }

  async getStaffAnalytics(_req: Request, res: Response) {
    const analytics = await analyticsService.getStaffAnalytics();
    return analytics;
  }
}