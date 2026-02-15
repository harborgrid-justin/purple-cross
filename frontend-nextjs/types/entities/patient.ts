import type { Client } from './client';

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: string;
  ownerId: string;
  owner?: Client;
  microchipId?: string;
  color?: string;
  weight?: number;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientDto {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: string;
  ownerId: string;
  microchipId?: string;
  color?: string;
  weight?: number;
  notes?: string;
}

export interface UpdatePatientDto {
  name?: string;
  species?: string;
  breed?: string;
  dateOfBirth?: Date;
  gender?: string;
  microchipId?: string;
  color?: string;
  weight?: number;
  isActive?: boolean;
  notes?: string;
}
