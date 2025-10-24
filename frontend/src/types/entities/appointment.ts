/**
 * Appointment Entity Types
 * Aligned with backend Prisma schema
 */

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  clientId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  type: string;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  veterinarianId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  veterinarian?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface CreateAppointmentData {
  patientId: string;
  clientId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  type: string;
  status?: AppointmentStatus;
  reason?: string | null;
  notes?: string | null;
  veterinarianId?: string | null;
}

export interface UpdateAppointmentData {
  patientId?: string;
  clientId?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  status?: AppointmentStatus;
  reason?: string | null;
  notes?: string | null;
  veterinarianId?: string | null;
}

export interface AppointmentFilters {
  search?: string;
  patientId?: string;
  clientId?: string;
  veterinarianId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  startDate?: string;
  endDate?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
