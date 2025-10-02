/**
 * Patient Management Module
 * Handles all patient (pet) related data and operations
 */

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'unknown';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  color: string;
  markings: string;
  microchipId?: string;
  ownerId: string;
  status: 'active' | 'inactive' | 'deceased';
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientRegistration {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'unknown';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  color: string;
  markings: string;
  microchipId?: string;
  ownerId: string;
}

export interface PatientSearchCriteria {
  name?: string;
  species?: string;
  breed?: string;
  ownerId?: string;
  status?: 'active' | 'inactive' | 'deceased';
  ageRange?: { min: number; max: number };
}

export interface PatientDemographics {
  totalPatients: number;
  bySpecies: Record<string, number>;
  byBreed: Record<string, number>;
  ageDistribution: Record<string, number>;
  geographicDistribution: Record<string, number>;
}

export interface VitalSigns {
  patientId: string;
  temperature: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  heartRate: number;
  respiratoryRate: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  recordedAt: Date;
  recordedBy: string;
}

export interface PatientHealthStatus {
  patientId: string;
  chronicConditions: string[];
  currentMedications: string[];
  allergies: string[];
  lastVaccinationDate?: Date;
  vaccinationsUpToDate: boolean;
  healthAlerts: HealthAlert[];
}

export interface HealthAlert {
  id: string;
  type: 'vaccination' | 'medication' | 'checkup' | 'chronic_condition' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  dueDate?: Date;
  resolved: boolean;
}

export interface BreedInformation {
  breed: string;
  species: string;
  commonHealthIssues: string[];
  averageLifespan: number;
  temperament: string[];
  careGuidelines: string;
  nutritionalRecommendations: string;
}

export interface PatientRelationship {
  patientId: string;
  relatedPatientId: string;
  relationship: 'parent' | 'offspring' | 'sibling' | 'littermate';
  notes?: string;
}

export interface PatientReminder {
  id: string;
  patientId: string;
  type: 'vaccination' | 'checkup' | 'medication' | 'followup' | 'custom';
  title: string;
  description: string;
  dueDate: Date;
  notificationDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface PatientLifecycle {
  patientId: string;
  birthDate?: Date;
  adoptionDate?: Date;
  acquisitionDate: Date;
  transferHistory: PatientTransfer[];
  deceasedDate?: Date;
  causeOfDeath?: string;
  archived: boolean;
}

export interface PatientTransfer {
  id: string;
  fromOwnerId: string;
  toOwnerId: string;
  transferDate: Date;
  reason: string;
  authorizedBy: string;
}
