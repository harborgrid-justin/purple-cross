/**
 * Communication & Messaging Module
 * Handles multi-channel client communication and messaging
 */

export interface ClientPortalUser {
  id: string;
  clientId: string;
  username: string;
  passwordHash: string;
  email: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'email' | 'authenticator';
  lastLogin?: Date;
  loginCount: number;
  failedLoginAttempts: number;
  accountLocked: boolean;
  accountLockedUntil?: Date;
  registrationDate: Date;
  active: boolean;
}

export interface PortalAccess {
  userId: string;
  features: PortalFeature[];
  preferences: PortalPreferences;
}

export interface PortalFeature {
  feature: 'medical_records' | 'appointments' | 'billing' | 'prescriptions' | 'documents' | 'messaging';
  enabled: boolean;
  permissions: string[];
}

export interface PortalPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  prescriptionReminders: boolean;
  billingAlerts: boolean;
  marketingMessages: boolean;
}

export interface SMSMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'received';
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  campaignId?: string;
  clientId?: string;
  cost?: number;
}

export interface SMSCampaign {
  id: string;
  name: string;
  description?: string;
  messageTemplate: string;
  segmentId?: string;
  recipients: string[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: Date;
}

export interface EmailMessage {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  from: string;
  replyTo?: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  attachments: EmailAttachment[];
  direction: 'inbound' | 'outbound';
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  campaignId?: string;
  clientId?: string;
}

export interface EmailAttachment {
  fileName: string;
  contentType: string;
  size: number;
  url?: string;
  data?: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  subject: string;
  bodyTemplate: string;
  segmentId?: string;
  recipients: string[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  createdBy: string;
  createdAt: Date;
}

export interface VoiceCall {
  id: string;
  callType: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'busy' | 'no_answer';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  notes?: string;
  clientId?: string;
  handledBy?: string;
}

export interface CallQueue {
  id: string;
  name: string;
  maxSize: number;
  currentSize: number;
  averageWaitTime: number;
  longestWaitTime: number;
  calls: QueuedCall[];
  agents: string[];
}

export interface QueuedCall {
  callId: string;
  from: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  queuedAt: Date;
  waitTime: number;
}

export interface Voicemail {
  id: string;
  callId: string;
  from: string;
  to: string;
  recordingUrl: string;
  transcription?: string;
  duration: number;
  receivedAt: Date;
  listened: boolean;
  listenedAt?: Date;
  listenedBy?: string;
  notes?: string;
}

export interface TelemedicineSession {
  id: string;
  patientId: string;
  clientId: string;
  veterinarianId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  roomUrl: string;
  recordingUrl?: string;
  notes?: string;
  followUpRequired: boolean;
}

export interface VideoConference {
  sessionId: string;
  participants: Participant[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  features: ConferenceFeatures;
}

export interface Participant {
  userId: string;
  displayName: string;
  role: 'host' | 'presenter' | 'attendee';
  joinedAt: Date;
  leftAt?: Date;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export interface ConferenceFeatures {
  screenSharing: boolean;
  recording: boolean;
  chat: boolean;
  waitingRoom: boolean;
  breakoutRooms: boolean;
}

export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: number;
  sound?: string;
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'clicked';
  sentAt?: Date;
  deliveredAt?: Date;
  clickedAt?: Date;
  deviceTokens: string[];
}

export interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  active: boolean;
  lastSync?: Date;
}

export interface SocialMediaPost {
  id: string;
  accountId: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  mediaUrls: string[];
  scheduledFor?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement: PostEngagement;
}

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}

export interface SocialMessage {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  conversationId: string;
  from: string;
  to: string;
  content: string;
  receivedAt: Date;
  read: boolean;
  readAt?: Date;
  replied: boolean;
  repliedAt?: Date;
  replyContent?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'social' | 'multi_channel';
  targetSegment: string;
  startDate: Date;
  endDate: Date;
  budget?: number;
  goals: CampaignGoal[];
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  performance: CampaignPerformance;
}

export interface CampaignGoal {
  metric: 'reach' | 'engagement' | 'conversions' | 'revenue' | 'appointments';
  target: number;
  actual: number;
}

export interface CampaignPerformance {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  roi: number;
  costPerAcquisition: number;
}

export interface ABTest {
  id: string;
  campaignId: string;
  name: string;
  variants: ABVariant[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  winner?: string;
}

export interface ABVariant {
  id: string;
  name: string;
  content: string;
  audienceSize: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  conversionRate: number;
}
