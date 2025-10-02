/**
 * Laboratory Management Module
 * Handles in-house and external lab testing
 */

import { Address } from './CommonTypes';

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category: string;
  specimenType: string;
  requiresSpecialHandling: boolean;
  turnaroundTime: number;
  turnaroundUnit: 'hours' | 'days';
  price: number;
  inHouse: boolean;
  externalLabId?: string;
  active: boolean;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  clientId: string;
  veterinarianId: string;
  orderDate: Date;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'sample_collected' | 'in_progress' | 'completed' | 'cancelled';
  tests: OrderedTest[];
  clinicalNotes?: string;
  expectedCompletionDate?: Date;
}

export interface OrderedTest {
  testId: string;
  testName: string;
  specimenId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  resultId?: string;
}

export interface LabResult {
  id: string;
  orderId: string;
  testId: string;
  patientId: string;
  resultDate: Date;
  status: 'preliminary' | 'final' | 'corrected';
  values: ResultValue[];
  interpretation?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  criticalValues: CriticalValue[];
  attachments: string[];
}

export interface ResultValue {
  parameter: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  flag?: 'low' | 'high' | 'critical' | 'abnormal' | 'normal';
  notes?: string;
}

export interface CriticalValue {
  parameter: string;
  value: string | number;
  criticalThreshold: string;
  notifiedTo: string;
  notifiedAt: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface Specimen {
  id: string;
  specimenNumber: string;
  patientId: string;
  collectionDate: Date;
  collectedBy: string;
  specimenType: 'blood' | 'urine' | 'feces' | 'tissue' | 'fluid' | 'swab' | 'other';
  volume?: number;
  volumeUnit?: string;
  containerType: string;
  storageLocation?: string;
  storageTemperature?: string;
  status: 'collected' | 'stored' | 'testing' | 'disposed' | 'transferred';
  chainOfCustody: CustodyRecord[];
}

export interface CustodyRecord {
  timestamp: Date;
  action: 'collected' | 'received' | 'stored' | 'retrieved' | 'transferred' | 'disposed';
  performedBy: string;
  location?: string;
  notes?: string;
}

export interface ExternalLab {
  id: string;
  name: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  address: Address;
  integrationEnabled: boolean;
  apiCredentials?: Record<string, string>;
  averageTurnaround: number;
  active: boolean;
}

export interface TestCatalog {
  labId?: string;
  tests: LabTest[];
  panels: TestPanel[];
  profiles: TestProfile[];
}

export interface TestPanel {
  id: string;
  name: string;
  description: string;
  includedTests: string[];
  price: number;
}

export interface TestProfile {
  id: string;
  name: string;
  description: string;
  species: string[];
  condition: string;
  recommendedTests: string[];
}

export interface QualityControl {
  id: string;
  testId: string;
  controlDate: Date;
  controlType: 'daily' | 'weekly' | 'monthly' | 'per_lot';
  controlSample: string;
  expectedValue: string;
  actualValue: string;
  acceptable: boolean;
  performedBy: string;
  correctiveAction?: string;
  verifiedBy?: string;
}

export interface InstrumentCalibration {
  id: string;
  instrumentId: string;
  calibrationDate: Date;
  nextCalibrationDate: Date;
  calibrationType: 'routine' | 'after_maintenance' | 'verification';
  results: CalibrationResult[];
  acceptable: boolean;
  performedBy: string;
  notes?: string;
}

export interface CalibrationResult {
  parameter: string;
  expectedValue: string;
  actualValue: string;
  acceptable: boolean;
}

export interface LabEquipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'operational' | 'maintenance' | 'out_of_service';
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  serviceHistory: ServiceRecord[];
}

export interface ServiceRecord {
  date: Date;
  serviceType: 'routine_maintenance' | 'repair' | 'calibration' | 'inspection';
  performedBy: string;
  description: string;
  cost?: number;
  downtime: number;
  nextServiceDue?: Date;
}

export interface LabAnalytics {
  period: { start: Date; end: Date };
  totalTests: number;
  testsByCategory: Record<string, number>;
  averageTurnaround: number;
  inHouseVsExternal: { inHouse: number; external: number };
  costPerTest: number;
  utilization: EquipmentUtilization[];
  positiveResults: ResultTrending[];
}

export interface EquipmentUtilization {
  equipmentId: string;
  equipmentName: string;
  totalTests: number;
  uptime: number;
  downtime: number;
  utilizationRate: number;
}

export interface ResultTrending {
  testName: string;
  positiveCount: number;
  totalCount: number;
  positiveRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}
