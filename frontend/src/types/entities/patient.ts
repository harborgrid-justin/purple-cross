/**
 * Patient Entity Types
 * Aligned with backend Prisma schema
 */

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  gender: string | null;
  color: string | null;
  microchipId: string | null; // NOTE: Changed from microchipNumber to match backend
  ownerId: string;
  profileImageUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientWithOwner extends Patient {
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface CreatePatientData {
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  weight?: number | null;
  gender?: string | null;
  color?: string | null;
  microchipId?: string | null;
  ownerId: string;
  profileImageUrl?: string | null;
  notes?: string | null;
}

export interface UpdatePatientData {
  name?: string;
  species?: string;
  breed?: string | null;
  age?: number | null;
  weight?: number | null;
  gender?: string | null;
  color?: string | null;
  microchipId?: string | null;
  ownerId?: string;
  profileImageUrl?: string | null;
  notes?: string | null;
}

export interface PatientFilters {
  search?: string;
  species?: string;
  ownerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
