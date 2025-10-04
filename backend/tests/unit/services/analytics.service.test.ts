import { AnalyticsService } from '../../../src/services/analytics.service';
import { prisma } from '../../../src/config/database';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    patient: { count: jest.fn() },
    appointment: { count: jest.fn(), findMany: jest.fn() },
    invoice: { aggregate: jest.fn(), findMany: jest.fn() },
  },
}));

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
    jest.clearAllMocks();
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', async () => {
      const mockMetrics = {
        totalPatients: 100,
        totalAppointments: 50,
        totalRevenue: 10000,
        activeClients: 75,
      };

      (prisma.patient.count as jest.Mock).mockResolvedValue(100);
      (prisma.appointment.count as jest.Mock).mockResolvedValue(50);
      (prisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { total: 10000 },
      });

      const result = await analyticsService.getDashboardMetrics();

      expect(result).toHaveProperty('totalPatients');
      expect(result.totalPatients).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getRevenueByPeriod', () => {
    it('should return revenue for specified period', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue([
        { date: new Date('2024-01-15'), total: 100 },
        { date: new Date('2024-02-15'), total: 200 },
      ]);

      const result = await analyticsService.getRevenueByPeriod(startDate, endDate);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAppointmentStatistics', () => {
    it('should return appointment statistics', async () => {
      (prisma.appointment.count as jest.Mock).mockResolvedValue(100);
      (prisma.appointment.findMany as jest.Mock).mockResolvedValue([
        { status: 'completed', count: 80 },
        { status: 'cancelled', count: 10 },
        { status: 'no-show', count: 10 },
      ]);

      const result = await analyticsService.getAppointmentStatistics();

      expect(result).toHaveProperty('total');
      expect(typeof result.total).toBe('number');
    });
  });
});
