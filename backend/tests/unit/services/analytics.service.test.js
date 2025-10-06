"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = require("../../../src/services/analytics.service");
const database_1 = require("../../../src/config/database");
jest.mock('../../../src/config/database', () => ({
    prisma: {
        patient: { count: jest.fn() },
        appointment: { count: jest.fn(), findMany: jest.fn() },
        invoice: { aggregate: jest.fn(), findMany: jest.fn() },
    },
}));
describe('AnalyticsService', () => {
    let analyticsService;
    beforeEach(() => {
        analyticsService = new analytics_service_1.AnalyticsService();
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
            database_1.prisma.patient.count.mockResolvedValue(100);
            database_1.prisma.appointment.count.mockResolvedValue(50);
            database_1.prisma.invoice.aggregate.mockResolvedValue({
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
            database_1.prisma.invoice.findMany.mockResolvedValue([
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
            database_1.prisma.appointment.count.mockResolvedValue(100);
            database_1.prisma.appointment.findMany.mockResolvedValue([
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
//# sourceMappingURL=analytics.service.test.js.map