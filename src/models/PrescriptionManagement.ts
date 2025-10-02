/**
 * Prescription & Medication Management Module
 * Handles e-prescribing, medication tracking, and pharmacy integration
 */

import { Address } from './CommonTypes';

export interface Prescription {
  id: string;
  patientId: string;
  clientId: string;
  veterinarianId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  quantity: number;
  refills: number;
  refillsRemaining: number;
  instructions: string;
  prescribedDate: Date;
  expirationDate: Date;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  pharmacyId?: string;
  transmittedAt?: Date;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'other';
  strength: string;
  species: string[];
  category: string;
  controlledSubstance: boolean;
  deaSchedule?: string;
  contraindications: string[];
  sideEffects: string[];
  storageRequirements: string;
}

export interface DosageGuideline {
  medicationId: string;
  species: string;
  condition: string;
  minDosePerKg: number;
  maxDosePerKg: number;
  frequency: string;
  duration: string;
  warnings: string[];
}

export interface PrescriptionHistory {
  patientId: string;
  prescriptions: Prescription[];
  refills: PrescriptionRefill[];
  discontinuedMedications: DiscontinuedMedication[];
}

export interface PrescriptionRefill {
  id: string;
  prescriptionId: string;
  refillDate: Date;
  authorizedBy: string;
  pharmacyId?: string;
  dispensedDate?: Date;
}

export interface DiscontinuedMedication {
  prescriptionId: string;
  medicationName: string;
  discontinuedDate: Date;
  reason: string;
  discontinuedBy: string;
}

export interface DosageCalculator {
  patientWeight: number;
  weightUnit: 'kg' | 'lbs';
  medicationId: string;
  condition: string;
  calculatedDose: number;
  frequency: string;
  warnings: string[];
}

export interface DrugInteraction {
  medication1Id: string;
  medication2Id: string;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  description: string;
  recommendation: string;
  alternatives: string[];
}

export interface AllergyCheck {
  patientId: string;
  medicationId: string;
  hasAllergy: boolean;
  allergyType?: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe' | 'life_threatening';
}

export interface ControlledSubstanceLog {
  id: string;
  medicationId: string;
  deaSchedule: string;
  date: Date;
  action: 'received' | 'dispensed' | 'destroyed' | 'transferred';
  quantity: number;
  balanceAfter: number;
  patientId?: string;
  veterinarianId: string;
  witnessId?: string;
  notes?: string;
}

export interface PharmacyIntegration {
  id: string;
  pharmacyName: string;
  address: Address;
  phoneNumber: string;
  faxNumber?: string;
  electronicSubmissionEnabled: boolean;
  credentials: Record<string, string>;
  active: boolean;
}

export interface MedicationReminder {
  id: string;
  prescriptionId: string;
  clientId: string;
  reminderType: 'refill' | 'administration' | 'follow_up';
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  acknowledged: boolean;
}

export interface CompoundedMedication {
  id: string;
  name: string;
  formula: CompoundFormula;
  ingredients: Ingredient[];
  preparationInstructions: string;
  batchNumber?: string;
  preparedDate?: Date;
  expirationDate?: Date;
  stability: string;
  preparedBy?: string;
}

export interface CompoundFormula {
  id: string;
  name: string;
  description: string;
  yields: number;
  yieldUnit: string;
}

export interface Ingredient {
  medicationId?: string;
  name: string;
  quantity: number;
  unit: string;
  concentration?: string;
}
