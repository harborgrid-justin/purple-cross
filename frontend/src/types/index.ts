/**
 * WF-COMP-XXX | index.ts - index
 * Purpose: Module exports and re-exports
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .ts
 */

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: string;
  ownerId: string;
  owner?: Client;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  clientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  status: string;
  reason: string;
  notes?: string;
  veterinarianId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
