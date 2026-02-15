export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  isActive: boolean;
  hireDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  hireDate: Date;
  notes?: string;
}

export interface UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  specialization?: string;
  licenseNumber?: string;
  isActive?: boolean;
  hireDate?: Date;
  notes?: string;
}
