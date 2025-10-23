import { Job, Queue } from 'bullmq';
import { logger } from '../config/logger';
import { workflowEngineService } from '../services/workflow-engine.service';
import { WorkflowAction } from '../types/workflow-types';
import Redis from 'ioredis';

// Redis connection for BullMQ
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

// Create workflows queue
export const workflowsQueue = new Queue('workflows', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      count: 100,
      age: 24 * 3600, // 24 hours
    },
    removeOnFail: {
      count: 1000,
    },
  },
});

export interface WorkflowJobPayload {
  type: 'execute_template' | 'execute_custom';
  templateId?: string;
  workflowName?: string;
  triggerType: string;
  triggerData: Record<string, unknown>;
  actions?: WorkflowAction[];
}

/**
 * Queue a workflow execution
 */
export async function queueWorkflow(payload: WorkflowJobPayload): Promise<void> {
  await workflowsQueue.add(`workflow-${payload.type}`, payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });

  logger.info('Workflow queued for execution', {
    type: payload.type,
    templateId: payload.templateId,
    workflowName: payload.workflowName,
  });
}

/**
 * Queue a scheduled workflow
 */
export async function queueScheduledWorkflow(
  templateId: string,
  triggerData: Record<string, unknown>,
  scheduleTime: Date
): Promise<void> {
  const delay = scheduleTime.getTime() - Date.now();

  if (delay < 0) {
    throw new Error('Schedule time must be in the future');
  }

  await workflowsQueue.add(
    `workflow-scheduled-${templateId}`,
    {
      type: 'execute_template',
      templateId,
      triggerType: 'schedule',
      triggerData,
    } as WorkflowJobPayload,
    {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    }
  );

  logger.info('Scheduled workflow queued', {
    templateId,
    scheduleTime: scheduleTime.toISOString(),
    delay: `${delay}ms`,
  });
}

/**
 * Process workflow job
 */
export async function processWorkflowJob(job: Job<WorkflowJobPayload>): Promise<void> {
  const { type, templateId, workflowName, triggerType, triggerData, actions } = job.data;

  logger.info('Processing workflow job', {
    jobId: job.id,
    type,
    templateId,
    workflowName,
    attempt: job.attemptsMade,
  });

  try {
    if (type === 'execute_template') {
      if (!templateId) {
        throw new Error('Template ID is required for template execution');
      }

      await workflowEngineService.executeWorkflowFromTemplate(templateId, triggerData);

      logger.info('Workflow from template executed successfully', {
        jobId: job.id,
        templateId,
      });
    } else if (type === 'execute_custom') {
      if (!workflowName || !actions) {
        throw new Error('Workflow name and actions are required for custom execution');
      }

      await workflowEngineService.executeWorkflow(
        workflowName,
        triggerType,
        triggerData,
        actions
      );

      logger.info('Custom workflow executed successfully', {
        jobId: job.id,
        workflowName,
      });
    } else {
      throw new Error(`Unknown workflow job type: ${type}`);
    }
  } catch (error) {
    logger.error('Workflow job processing failed', {
      jobId: job.id,
      type,
      templateId,
      workflowName,
      error: error instanceof Error ? error.message : 'Unknown error',
      attempt: job.attemptsMade,
    });

    throw error;
  }
}
