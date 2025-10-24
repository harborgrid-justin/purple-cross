/**
 * Staff Entity Types
 * Aligned with backend Prisma schema
 */

export type StaffRole = 'VETERINARIAN' | 'TECHNICIAN' | 'RECEPTIONIST' | 'MANAGER' | 'ASSISTANT';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  employmentType: EmploymentType; // CRITICAL: Required field, was missing in original types
  licenseNumber: string | null;
  specialization: string | null;
  hireDate: string; // ISO date
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  employmentType: EmploymentType; // Required!
  licenseNumber?: string | null;
  specialization?: string | null;
  hireDate: string;
  isActive?: boolean;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  employmentType?: EmploymentType;
  licenseNumber?: string | null;
  specialization?: string | null;
  hireDate?: string;
  isActive?: boolean;
}

export interface StaffFilters {
  search?: string;
  role?: StaffRole | StaffRole[];
  employmentType?: EmploymentType;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
