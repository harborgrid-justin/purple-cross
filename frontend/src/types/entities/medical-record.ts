/**
 * Medical Record Entity Types
 * Aligned with backend Prisma schema
 */

export interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string; // ISO datetime
  chiefComplaint: string; // CRITICAL: Required field, was missing in original types
  diagnosis: string | null;
  treatment: string | null;
  prescriptions: string | null;
  notes: string | null;
  veterinarianId: string | null;
  followUpDate: string | null; // ISO datetime
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordWithDetails extends MedicalRecord {
  patient: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
  };
  veterinarian?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface CreateMedicalRecordData {
  patientId: string;
  visitDate: string; // ISO datetime
  chiefComplaint: string; // Required!
  diagnosis?: string | null;
  treatment?: string | null;
  prescriptions?: string | null;
  notes?: string | null;
  veterinarianId?: string | null;
  followUpDate?: string | null;
}

export interface UpdateMedicalRecordData {
  patientId?: string;
  visitDate?: string;
  chiefComplaint?: string;
  diagnosis?: string | null;
  treatment?: string | null;
  prescriptions?: string | null;
  notes?: string | null;
  veterinarianId?: string | null;
  followUpDate?: string | null;
}

export interface MedicalRecordFilters {
  patientId?: string;
  veterinarianId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
