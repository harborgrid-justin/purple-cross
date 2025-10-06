import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service';
import { HTTP_STATUS } from '../constants';

export class AnalyticsController {
  async getDashboardStats(_req: Request, res: Response) {
    const stats = await analyticsService.getDashboardStats();
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: stats,
    });
  }

  async getPatientDemographics(_req: Request, res: Response) {
    const demographics = await analyticsService.getPatientDemographics();
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: demographics,
    });
  }

  async getAppointmentAnalytics(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getAppointmentAnalytics(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: analytics,
    });
  }

  async getFinancialReport(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = req.query;
    const report = await analyticsService.getFinancialReport(
      startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate as string) : new Date()
    );
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: report,
    });
  }

  async getInventoryReport(_req: Request, res: Response) {
    const report = await analyticsService.getInventoryReport();
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: report,
    });
  }

  async getStaffAnalytics(_req: Request, res: Response) {
    const analytics = await analyticsService.getStaffAnalytics();
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: analytics,
    });
  }
}

export default new AnalyticsController();
