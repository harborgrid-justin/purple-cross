import { AnalyticsService } from '../../../src/services/analytics.service';
import { prisma } from '../../../src/config/database';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    patient: { count: jest.fn() },
    client: { count: jest.fn() },
    appointment: { count: jest.fn(), findMany: jest.fn(), groupBy: jest.fn() },
    invoice: { count: jest.fn(), aggregate: jest.fn(), findMany: jest.fn(), groupBy: jest.fn() },
  },
}));

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard metrics', async () => {
      (prisma.patient.count as jest.Mock).mockResolvedValue(100);
      (prisma.appointment.count as jest.Mock).mockResolvedValue(50);
      (prisma.invoice.aggregate as jest.Mock).mockResolvedValue({
        _sum: { total: 10000 },
      });

      const result = await analyticsService.getDashboardStats();

      expect(result).toHaveProperty('totalPatients');
      expect(result.totalPatients).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getFinancialReport', () => {
    it('should return revenue for specified period', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue([
        {
          invoiceDate: new Date('2024-01-15'),
          total: 100,
          payments: [{ amount: 50 }],
        },
        {
          invoiceDate: new Date('2024-02-15'),
          total: 200,
          payments: [{ amount: 100 }],
        },
      ]);
      (prisma.invoice.groupBy as jest.Mock).mockResolvedValue([
        { status: 'paid', _count: { status: 1 }, _sum: { total: 150 } },
        { status: 'pending', _count: { status: 1 }, _sum: { total: 150 } },
      ]);

      const result = await analyticsService.getFinancialReport(startDate, endDate);

      expect(result).toBeDefined();
      expect(result.totalRevenue).toBe(300);
      expect(result.totalPaid).toBe(150);
    });
  });

  describe('getAppointmentAnalytics', () => {
    it('should return appointment statistics', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      (prisma.appointment.groupBy as jest.Mock).mockResolvedValue([
        { status: 'completed', _count: { status: 80 } },
        { status: 'cancelled', _count: { status: 10 } },
      ]);

      const result = await analyticsService.getAppointmentAnalytics(startDate, endDate);

      expect(result).toHaveProperty('byStatus');
      expect(Array.isArray(result.byStatus)).toBe(true);
    });
  });
});
