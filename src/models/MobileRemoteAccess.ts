/**
 * Mobile & Remote Access Module
 * Handles mobile applications, remote access, and field service
 */

import { Address } from './CommonTypes';

export interface MobileDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'ios' | 'android' | 'tablet' | 'other';
  osVersion: string;
  appVersion: string;
  userId: string;
  registeredAt: Date;
  lastSeen?: Date;
  pushToken?: string;
  biometricEnabled: boolean;
  status: 'active' | 'inactive' | 'blocked';
}

export interface MobileSession {
  id: string;
  deviceId: string;
  userId: string;
  sessionToken: string;
  startTime: Date;
  endTime?: Date;
  lastActivity: Date;
  ipAddress?: string;
  location?: GeolocationData;
  status: 'active' | 'expired' | 'terminated';
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
}

export interface OfflineData {
  id: string;
  deviceId: string;
  userId: string;
  dataType: string;
  data: any;
  createdAt: Date;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'conflict' | 'failed';
  syncedAt?: Date;
  version: number;
}

export interface DataSync {
  id: string;
  deviceId: string;
  userId: string;
  syncType: 'full' | 'incremental';
  direction: 'download' | 'upload' | 'bidirectional';
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
  itemsToSync: number;
  itemsSynced: number;
  conflicts: SyncConflict[];
  errors: MobileSyncError[];
}

export interface SyncConflict {
  id: string;
  dataType: string;
  recordId: string;
  localVersion: any;
  serverVersion: any;
  conflictTime: Date;
  resolution?: 'use_local' | 'use_server' | 'merge' | 'manual';
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface MobileSyncError {
  dataType: string;
  recordId?: string;
  error: string;
  timestamp: Date;
  retryable: boolean;
  retryCount: number;
}

export interface TabletInterface {
  id: string;
  deviceId: string;
  interfaceType: 'exam_room' | 'checkout' | 'field_service' | 'inventory';
  configuration: TabletConfig;
  location: string;
  assignedTo?: string;
  lastUsed?: Date;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface TabletConfig {
  layout: string;
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  features: string[];
  offlineMode: boolean;
  autoSync: boolean;
  syncInterval: number;
}

export interface DigitalForm {
  id: string;
  formType: string;
  fields: FormField[];
  signatures: DigitalSignature[];
  photos: string[];
  completedBy: string;
  completedAt: Date;
  deviceId: string;
  location?: GeolocationData;
  synced: boolean;
}

export interface FormField {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  value: any;
  required: boolean;
}

export interface DigitalSignature {
  signerId: string;
  signerName: string;
  signerRole: string;
  signatureData: string;
  timestamp: Date;
  location?: GeolocationData;
}

export interface RemoteConnection {
  id: string;
  userId: string;
  connectionType: 'vpn' | 'browser' | 'rdp' | 'citrix';
  sourceIp: string;
  connectedAt: Date;
  disconnectedAt?: Date;
  duration?: number;
  location?: string;
  status: 'active' | 'disconnected';
  sessionData?: Record<string, any>;
}

export interface VPNConfiguration {
  id: string;
  serverAddress: string;
  protocol: 'openvpn' | 'ipsec' | 'wireguard';
  port: number;
  encryptionType: string;
  authenticationMethod: 'certificate' | 'username_password' | 'mfa';
  splitTunneling: boolean;
  allowedIPs?: string[];
  active: boolean;
}

export interface FieldServiceAppointment {
  id: string;
  appointmentId: string;
  patientId: string;
  clientId: string;
  technicianiId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  location: Address;
  gpsLocation?: GeolocationData;
  serviceType: string;
  status: 'scheduled' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  checklist: ServiceChecklistItem[];
}

export interface ServiceChecklistItem {
  id: string;
  task: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  photos?: string[];
}

export interface RouteOptimization {
  id: string;
  technicianId: string;
  date: Date;
  appointments: string[];
  startLocation: GeolocationData;
  optimizedRoute: RouteWaypoint[];
  totalDistance: number;
  estimatedDuration: number;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface RouteWaypoint {
  appointmentId: string;
  sequenceNumber: number;
  location: GeolocationData;
  arrivalTime: Date;
  departureTime: Date;
  distance: number;
  duration: number;
}

export interface MobileInvoice {
  id: string;
  invoiceId?: string;
  appointmentId: string;
  clientId: string;
  items: MobileInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdBy: string;
  createdAt: Date;
  signature?: DigitalSignature;
  synced: boolean;
}

export interface MobileInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface EmergencyAccess {
  id: string;
  userId: string;
  accessType: 'read_only' | 'limited_edit';
  reason: string;
  patientId?: string;
  grantedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
  accessLog: EmergencyAccessLog[];
}

export interface EmergencyAccessLog {
  timestamp: Date;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: string;
}

export interface OfflineCapability {
  feature: string;
  supportsOffline: boolean;
  cacheStrategy: 'none' | 'essential' | 'full';
  maxCacheAge: number;
  maxCacheSize: number;
  conflictResolution: 'server_wins' | 'client_wins' | 'last_write_wins' | 'manual';
}

export interface CacheData {
  id: string;
  deviceId: string;
  dataType: string;
  data: any;
  cachedAt: Date;
  expiresAt: Date;
  version: number;
  dirty: boolean;
}

export interface ConnectionStatus {
  deviceId: string;
  online: boolean;
  connectionType?: 'wifi' | 'cellular' | 'ethernet';
  signalStrength?: number;
  lastChecked: Date;
  pendingSyncItems: number;
}

export interface MobileDashboard {
  userId: string;
  deviceId: string;
  widgets: MobileWidget[];
  refreshInterval: number;
  lastRefresh: Date;
}

export interface MobileWidget {
  id: string;
  type: 'kpi' | 'list' | 'chart' | 'quick_action';
  title: string;
  data: any;
  position: number;
  size: 'small' | 'medium' | 'large';
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  parameters?: Record<string, any>;
  requiresOnline: boolean;
  position: number;
}

export interface MobileReport {
  id: string;
  reportType: string;
  deviceId: string;
  userId: string;
  period: { start: Date; end: Date };
  data: any;
  generatedAt: Date;
  format: 'pdf' | 'json' | 'csv';
  fileUrl?: string;
  shared: boolean;
}

export interface DeviceManagement {
  id: string;
  deviceId: string;
  managedBy: string;
  policies: DevicePolicy[];
  lastPolicyUpdate: Date;
  complianceStatus: 'compliant' | 'non_compliant' | 'unknown';
  lastComplianceCheck: Date;
}

export interface DevicePolicy {
  policyName: string;
  policyType: 'security' | 'app' | 'network' | 'data';
  settings: Record<string, any>;
  enforced: boolean;
  compliant: boolean;
}

export interface CrossPlatformSync {
  userId: string;
  devices: string[];
  lastSyncTime: Date;
  syncStatus: Record<string, SyncStatus>;
  conflicts: number;
  pendingChanges: number;
}

export interface SyncStatus {
  deviceId: string;
  lastSync: Date;
  status: 'synced' | 'pending' | 'error';
  version: number;
}

export interface MobileAnalytics {
  period: { start: Date; end: Date };
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  deviceBreakdown: Record<string, number>;
  featureUsage: Record<string, number>;
  crashRate: number;
  offlineUsage: number;
}
