/**
 * Appointment Scheduling & Calendar Module
 * Handles all appointment and calendar-related operations
 */

export interface Appointment {
  id: string;
  patientId: string;
  clientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  veterinarianId: string;
  roomId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  defaultDuration: number;
  bufferTime: number;
  color: string;
  allowOnlineBooking: boolean;
  price?: number;
}

export interface CalendarSlot {
  resourceId: string;
  resourceType: 'veterinarian' | 'room' | 'equipment';
  startTime: Date;
  endTime: Date;
  available: boolean;
  appointmentId?: string;
  blockType?: 'break' | 'surgery' | 'meeting' | 'emergency';
}

export interface RecurringAppointment {
  appointmentId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[];
  exceptions: Date[];
}

export interface Waitlist {
  id: string;
  patientId: string;
  clientId: string;
  appointmentType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  preferredDates: Date[];
  preferredTimes: TimeRange[];
  notes?: string;
  addedAt: Date;
  status: 'waiting' | 'offered' | 'booked' | 'expired';
}

export interface TimeRange {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface AppointmentReminder {
  appointmentId: string;
  clientId: string;
  reminderType: 'sms' | 'email' | 'phone' | 'push';
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  confirmed?: boolean;
  confirmedAt?: Date;
}

export interface ScheduleBlock {
  id: string;
  resourceId: string;
  resourceType: 'veterinarian' | 'room';
  blockType: 'lunch' | 'surgery' | 'meeting' | 'training' | 'vacation' | 'emergency';
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  notes?: string;
}

export interface ScheduleOptimization {
  date: Date;
  totalSlots: number;
  bookedSlots: number;
  utilizationRate: number;
  gaps: TimeGap[];
  recommendations: OptimizationRecommendation[];
}

export interface TimeGap {
  resourceId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface OptimizationRecommendation {
  type: 'fill_gap' | 'reduce_wait' | 'balance_load';
  description: string;
  potentialImpact: string;
}

export interface AppointmentAnalytics {
  period: { start: Date; end: Date };
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShows: number;
  noShowRate: number;
  averageWaitTime: number;
  appointmentTypeDistribution: Record<string, number>;
  revenuePerAppointment: number;
  seasonalTrends: SeasonalTrend[];
}

export interface SeasonalTrend {
  month: number;
  year: number;
  appointmentCount: number;
  revenue: number;
}
