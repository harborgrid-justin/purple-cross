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

  @Get('dashboard')
  async getDashboardStats() {
    const stats = await this.analyticsService.getDashboardStats();
    return stats;
  }

  @Get('patient-demographics')
  async getPatientDemographics() {
    const demographics = await this.analyticsService.getPatientDemographics();
    return demographics;
  }

  @Get('appointments')
  async getAppointmentAnalytics(@Query() query: any) {
    const { startDate, endDate } = query;
    const analytics = await this.analyticsService.getAppointmentAnalytics(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    return analytics;
  }

  @Get('financial')
  async getFinancialReport(@Query() query: any) {
    const { startDate, endDate } = query;
    const report = await this.analyticsService.getFinancialReport(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    return report;
  }

  @Get('inventory')
  async getInventoryReport() {
    const report = await this.analyticsService.getInventoryReport();
    return report;
  }

  @Get('staff')
  async getStaffAnalytics() {
    const analytics = await this.analyticsService.getStaffAnalytics();
    return analytics;
  }
}
