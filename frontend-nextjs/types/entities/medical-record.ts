import type { Patient } from './patient';
import type { Staff } from './staff';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patient?: Patient;
  visitDate: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  veterinarianId: string;
  veterinarian?: Staff;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalRecordDto {
  patientId: string;
  visitDate: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  veterinarianId: string;
}

export interface UpdateMedicalRecordDto {
  visitDate?: Date;
  chiefComplaint?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}
