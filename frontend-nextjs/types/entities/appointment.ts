import type { Patient } from './patient';
import type { Client } from './client';
import type { Staff } from './staff';

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  clientId: string;
  client?: Client;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  status: string;
  reason: string;
  notes?: string;
  veterinarianId: string;
  veterinarian?: Staff;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentDto {
  patientId: string;
  clientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  notes?: string;
  veterinarianId: string;
}

export interface UpdateAppointmentDto {
  appointmentType?: string;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  reason?: string;
  notes?: string;
  veterinarianId?: string;
}
