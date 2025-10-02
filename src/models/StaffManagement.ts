/**
 * Staff & User Management Module
 * Handles employee profiles, roles, scheduling, and HR functions
 */

import { Address, EmergencyContact } from './CommonTypes';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'veterinarian' | 'veterinary_technician' | 'receptionist' | 'manager' | 'assistant' | 'administrator';
  department: string;
  hireDate: Date;
  status: 'active' | 'on_leave' | 'suspended' | 'terminated';
  address: Address;
  emergencyContact: EmergencyContact;
  credentials: Credential[];
  userId: string;
}

export interface Credential {
  id: string;
  type: 'veterinary_license' | 'dea_registration' | 'certification' | 'continuing_education' | 'other';
  name: string;
  number?: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  status: 'active' | 'expired' | 'pending_renewal';
  documentUrl?: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  employeeId?: string;
  roleId: string;
  permissions: Permission[];
  active: boolean;
  lastLogin?: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  active: boolean;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  scope?: 'own' | 'department' | 'all';
}

export interface Shift {
  id: string;
  employeeId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  shiftType: 'regular' | 'on_call' | 'emergency' | 'training';
  location: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface ShiftSwap {
  id: string;
  originalEmployeeId: string;
  originalShiftId: string;
  requestedEmployeeId: string;
  status: 'pending' | 'approved' | 'denied' | 'completed' | 'cancelled';
  requestDate: Date;
  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  requestType: 'vacation' | 'sick_leave' | 'personal' | 'unpaid' | 'other';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  requestDate: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours?: number;
  regularHours?: number;
  overtimeHours?: number;
  status: 'active' | 'completed' | 'approved' | 'disputed';
  approvedBy?: string;
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriodStart: Date;
  reviewPeriodEnd: Date;
  reviewDate: Date;
  reviewerId: string;
  overallRating: number;
  categories: ReviewCategory[];
  strengths: string[];
  areasForImprovement: string[];
  goals: PerformanceGoal[];
  comments?: string;
  employeeComments?: string;
  employeeSignature?: string;
  employeeSignedAt?: Date;
  status: 'draft' | 'in_review' | 'completed' | 'acknowledged';
}

export interface ReviewCategory {
  name: string;
  rating: number;
  maxRating: number;
  comments?: string;
}

export interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'missed';
  completedDate?: Date;
  notes?: string;
}

export interface StaffTrainingRecord {
  id: string;
  employeeId: string;
  trainingName: string;
  trainingType: 'continuing_education' | 'certification' | 'in_house' | 'online' | 'conference';
  provider: string;
  completionDate: Date;
  hours: number;
  ceCredits?: number;
  certificateUrl?: string;
  expirationDate?: Date;
  cost?: number;
}

export interface StaffMessage {
  id: string;
  fromUserId: string;
  toUserIds: string[];
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sentAt: Date;
  readBy: Record<string, Date>;
  archived: boolean;
}

export interface BulletinPost {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'policy' | 'schedule' | 'training' | 'general';
  postedBy: string;
  postedAt: Date;
  expirationDate?: Date;
  pinned: boolean;
  attachments: string[];
}

export interface HandoffNote {
  id: string;
  shiftId: string;
  fromEmployeeId: string;
  toEmployeeId?: string;
  date: Date;
  priority: 'low' | 'normal' | 'high';
  category: 'patient_update' | 'task' | 'issue' | 'reminder' | 'general';
  content: string;
  completed: boolean;
  completedAt?: Date;
}

export interface HRDocument {
  id: string;
  employeeId?: string;
  documentType: 'handbook' | 'policy' | 'contract' | 'review' | 'training' | 'other';
  title: string;
  description?: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  requiresAcknowledgment: boolean;
  acknowledgedBy?: Record<string, Date>;
  confidential: boolean;
}

export interface ProductivityMetrics {
  employeeId: string;
  period: { start: Date; end: Date };
  appointmentsSeen: number;
  proceduresPerformed: number;
  averageAppointmentDuration: number;
  clientSatisfactionScore: number;
  revenueGenerated: number;
  efficiency: number;
}
