/**
 * Client (Pet Owner) Management Module
 * Handles all client-related data and operations
 */

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
  preferredContactMethod: 'email' | 'sms' | 'phone' | 'portal';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface ClientAccount {
  clientId: string;
  accountStatus: 'active' | 'inactive' | 'suspended' | 'collections';
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  paymentHistory: Payment[];
  lastPaymentDate?: Date;
}

export interface Payment {
  id: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'check' | 'payment_plan';
  transactionDate: Date;
  reference: string;
  appliedTo: string[];
}

export interface HouseholdPets {
  clientId: string;
  petIds: string[];
  primaryContact: string;
  householdMembers: HouseholdMember[];
}

export interface HouseholdMember {
  name: string;
  relationship: string;
  canAuthorize: boolean;
  contactInfo?: string;
}

export interface CommunicationHistory {
  id: string;
  clientId: string;
  type: 'email' | 'sms' | 'phone' | 'portal' | 'in_person';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  timestamp: Date;
  staffMemberId?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ClientPortalAccess {
  clientId: string;
  username: string;
  passwordHash: string;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  permissions: string[];
}

export interface LoyaltyProgram {
  clientId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewardsEarned: Reward[];
  rewardsRedeemed: Reward[];
  referrals: ClientReferral[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsValue: number;
  earnedDate?: Date;
  redeemedDate?: Date;
  expirationDate?: Date;
}

export interface ClientReferral {
  id: string;
  referredClientId: string;
  referralDate: Date;
  status: 'pending' | 'completed' | 'rewarded';
  rewardAmount: number;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  type: 'satisfaction_survey' | 'complaint' | 'testimonial' | 'review' | 'suggestion';
  rating?: number;
  content: string;
  submittedAt: Date;
  status: 'new' | 'in_review' | 'resolved' | 'closed';
  response?: string;
  respondedAt?: Date;
  npsScore?: number;
}

export interface ClientSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  clientIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentCriteria {
  vipStatus?: boolean;
  spendingTier?: 'low' | 'medium' | 'high' | 'vip';
  visitFrequency?: { min: number; max: number };
  servicePreferences?: string[];
  lastVisitDays?: number;
}
