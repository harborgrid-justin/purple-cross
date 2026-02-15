/**
 * Workflow type definitions
 */

/**
 * Workflow execution status
 */
export enum WorkflowExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

/**
 * Workflow trigger type
 */
export enum WorkflowTriggerType {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  EVENT = 'event',
  WEBHOOK = 'webhook',
  API = 'api',
}

/**
 * Workflow action type
 */
export enum WorkflowActionType {
  EMAIL = 'email',
  SMS = 'sms',
  NOTIFICATION = 'notification',
  API_CALL = 'api_call',
  DATABASE = 'database',
  WEBHOOK = 'webhook',
  CONDITION = 'condition',
  DELAY = 'delay',
  LOOP = 'loop',
  TRANSFORM = 'transform',
}

/**
 * Workflow action configuration
 */
export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  name: string;
  description?: string;
  config: Record<string, any>;
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  id: string;
  workflowId: string;
  action: WorkflowAction;
  nextStepId?: string;
  condition?: string;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
  };
}

/**
 * Workflow execution context
 */
export interface WorkflowExecutionContext {
  executionId: string;
  workflowId: string;
  triggerId?: string;
  input: Record<string, any>;
  variables: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  status: WorkflowExecutionStatus;
  currentStepId?: string;
  error?: string;
}

/**
 * Workflow trigger configuration
 */
export interface WorkflowTriggerConfig {
  type: WorkflowTriggerType;
  schedule?: string; // Cron expression for scheduled triggers
  event?: string; // Event name for event triggers
  webhookUrl?: string; // URL for webhook triggers
  conditions?: Record<string, any>;
}
