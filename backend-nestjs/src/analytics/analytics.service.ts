import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
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
      this.prisma.patient.count(),
      this.prisma.client.count(),
      this.prisma.appointment.count(),
      this.prisma.invoice.count(),
      this.prisma.patient.count({ where: { status: 'active' } }),
      this.prisma.appointment.count({
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      this.prisma.invoice.count({ where: { status: 'pending' } }),
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
      this.prisma.patient.groupBy({
        by: ['species'],
        _count: { species: true },
      }),
      this.prisma.patient.groupBy({
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
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: {
          startTime: { gte: startDate, lte: endDate },
        },
        _count: { status: true },
      }),
      this.prisma.appointment.groupBy({
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
    const invoices = await this.prisma.invoice.findMany({
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

    const byStatus = await this.prisma.invoice.groupBy({
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
      this.prisma.inventoryItem.count({
        where: {
          quantity: { lte: this.prisma.inventoryItem.fields.reorderPoint },
        },
      }),
      this.prisma.inventoryItem.count({
        where: {
          expirationDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            gte: new Date(),
          },
        },
      }),
      this.prisma.inventoryItem.count(),
    ]);

    const byCategory = await this.prisma.inventoryItem.groupBy({
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
      this.prisma.staff.count(),
      this.prisma.staff.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.staff.groupBy({
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