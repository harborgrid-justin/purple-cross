/**
 * Shared types between frontend and backend
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Common entity fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Patient types
export interface Patient extends BaseEntity {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: string;
  color?: string;
  weight?: number;
  microchipId?: string;
  insuranceProvider?: string;
  insurancePolicy?: string;
  status: string;
  ownerId: string;
}

// Client types
export interface Client extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
}

// Appointment types
export interface Appointment extends BaseEntity {
  patientId: string;
  clientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  status: string;
  reason: string;
  notes?: string;
  veterinarianId: string;
}
