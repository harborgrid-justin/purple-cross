/**
 * Workflow Engine Types
 * Defines the structure for workflow definitions and execution
 */

/**
 * Workflow Trigger Types
 */
export enum WorkflowTriggerType {
  EVENT = 'event',
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
}

/**
 * Workflow Action Types
 */
export enum WorkflowActionType {
  SEND_EMAIL = 'send_email',
  SEND_NOTIFICATION = 'send_notification',
  UPDATE_RECORD = 'update_record',
  CREATE_RECORD = 'create_record',
  WEBHOOK = 'webhook',
  WAIT = 'wait',
  CONDITION = 'condition',
}

/**
 * Workflow Status
 */
export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

/**
 * Workflow Execution Status
 */
export enum WorkflowExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Condition Operator
 */
export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

/**
 * Workflow Trigger Definition
 */
export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  config: {
    event?: string;
    schedule?: {
      cron?: string;
      timezone?: string;
      startDate?: string;
      endDate?: string;
    };
  };
}

/**
 * Workflow Action Definition
 */
export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  name: string;
  config: Record<string, unknown>;
  onSuccess?: string; // Next action ID
  onFailure?: string; // Next action ID on failure
}

/**
 * Workflow Condition
 */
export interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Workflow Definition
 */
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workflow Execution Context
 */
export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  triggerData: Record<string, unknown>;
  variables: Record<string, unknown>;
  startedAt: Date;
  currentActionId?: string;
}

/**
 * Workflow Execution Result
 */
export interface WorkflowExecutionResult {
  executionId: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  stepResults: WorkflowStepResult[];
}

/**
 * Workflow Step Result
 */
export interface WorkflowStepResult {
  actionId: string;
  actionName: string;
  status: 'success' | 'failed' | 'skipped';
  startedAt: Date;
  completedAt?: Date;
  output?: Record<string, unknown>;
  error?: string;
}
