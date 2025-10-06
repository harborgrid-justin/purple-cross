import { prisma } from '../config/database';

export class AnalyticsService {
  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalPatients,
      totalClients,
      totalAppointments,
      totalInvoices,
      activePatients,
      todayAppointments,
      pendingInvoices,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.client.count(),
      prisma.appointment.count(),
      prisma.invoice.count(),
      prisma.patient.count({ where: { status: 'active' } }),
      prisma.appointment.count({
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.invoice.count({ where: { status: 'pending' } }),
    ]);

    return {
      totalPatients,
      totalClients,
      totalAppointments,
      totalInvoices,
      activePatients,
      todayAppointments,
      pendingInvoices,
    };
  }

  // Patient Demographics
  async getPatientDemographics() {
    const [bySpecies, byStatus] = await Promise.all([
      prisma.patient.groupBy({
        by: ['species'],
        _count: { species: true },
      }),
      prisma.patient.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      bySpecies: bySpecies.map((item: any) => ({
        species: item.species,
        count: item._count.species,
      })),
      byStatus: byStatus.map((item: any) => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }

  // Appointment Analytics
  async getAppointmentAnalytics(startDate: Date, endDate: Date) {
    const [byStatus, byType] = await Promise.all([
      prisma.appointment.groupBy({
        by: ['status'],
        where: {
          startTime: { gte: startDate, lte: endDate },
        },
        _count: { status: true },
      }),
      prisma.appointment.groupBy({
        by: ['appointmentType'],
        where: {
          startTime: { gte: startDate, lte: endDate },
        },
        _count: { appointmentType: true },
      }),
    ]);

    return {
      byStatus: byStatus.map((item: any) => ({
        status: item.status,
        count: item._count.status,
      })),
      byType: byType.map((item: any) => ({
        type: item.appointmentType,
        count: item._count.appointmentType,
      })),
    };
  }

  // Financial Reports
  async getFinancialReport(startDate: Date, endDate: Date) {
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startDate, lte: endDate },
      },
      include: {
        payments: true,
      },
    });

    const totalRevenue = invoices.reduce((sum: any, inv: any) => sum + Number(inv.total), 0);
    const totalPaid = invoices
      .flatMap((inv: any) => inv.payments)
      .reduce((sum: any, payment: any) => sum + Number(payment.amount), 0);
    const totalPending = totalRevenue - totalPaid;

    const byStatus = await prisma.invoice.groupBy({
      by: ['status'],
      where: {
        invoiceDate: { gte: startDate, lte: endDate },
      },
      _count: { status: true },
      _sum: { total: true },
    });

    return {
      totalRevenue,
      totalPaid,
      totalPending,
      invoiceCount: invoices.length,
      byStatus: byStatus.map((item: any) => ({
        status: item.status,
        count: item._count.status,
        total: Number(item._sum.total || 0),
      })),
    };
  }

  // Inventory Report
  async getInventoryReport() {
    const [lowStockItems, expiringItems, totalItems] = await Promise.all([
      prisma.inventoryItem.count({
        where: {
          quantity: { lte: prisma.inventoryItem.fields.reorderPoint },
        },
      }),
      prisma.inventoryItem.count({
        where: {
          expirationDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            gte: new Date(),
          },
        },
      }),
      prisma.inventoryItem.count(),
    ]);

    const byCategory = await prisma.inventoryItem.groupBy({
      by: ['category'],
      _count: { category: true },
      _sum: { quantity: true },
    });

    return {
      lowStockItems,
      expiringItems,
      totalItems,
      byCategory: byCategory.map((item: any) => ({
        category: item.category,
        count: item._count.category,
        totalQuantity: item._sum.quantity || 0,
      })),
    };
  }

  // Staff Analytics
  async getStaffAnalytics() {
    const [totalStaff, byRole, byStatus] = await Promise.all([
      prisma.staff.count(),
      prisma.staff.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      prisma.staff.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      totalStaff,
      byRole: byRole.map((item: any) => ({
        role: item.role,
        count: item._count.role,
      })),
      byStatus: byStatus.map((item: any) => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }
}

export default new AnalyticsService();
