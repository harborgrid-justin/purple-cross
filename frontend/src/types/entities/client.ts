/**
 * Client Entity Types
 * Aligned with backend Prisma schema
 */

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string | null; // NOTE: Changed from secondaryPhone to match backend
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  emergencyContact: string | null; // Added - required in backend
  emergencyPhone: string | null; // Added - required in backend
  preferredContact: string | null; // Added - required in backend ('email', 'phone', 'text')
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientWithPatients extends Client {
  patients: Array<{
    id: string;
    name: string;
    species: string;
    breed: string | null;
  }>;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  preferredContact?: 'email' | 'phone' | 'text' | null;
  notes?: string | null;
}

export interface UpdateClientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  preferredContact?: 'email' | 'phone' | 'text' | null;
  notes?: string | null;
}

export interface ClientFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
