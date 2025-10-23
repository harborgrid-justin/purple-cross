import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER } from '../constants';
import {
  WorkflowAction,
  WorkflowExecutionStatus,
} from '../types/workflow-types';

interface StartExecutionData {
  templateId?: string;
  workflowName: string;
  triggerType: string;
  triggerData: Record<string, unknown>;
  actions: WorkflowAction[];
}

interface GetExecutionsOptions {
  page?: number;
  limit?: number;
  status?: string;
  templateId?: string;
}

export class WorkflowExecutionService {
  /**
   * Start a new workflow execution
   */
  async startExecution(data: StartExecutionData) {
    const execution = await prisma.workflowExecution.create({
      data: {
        templateId: data.templateId,
        workflowName: data.workflowName,
        triggerType: data.triggerType,
        triggerData: data.triggerData,
        status: WorkflowExecutionStatus.PENDING,
        variables: {},
        currentActionId: data.actions.length > 0 ? data.actions[0].id : undefined,
      },
      include: {
        template: true,
      },
    });

    // Create execution steps
    const steps = data.actions.map((action) => ({
      executionId: execution.id,
      actionId: action.id,
      actionType: action.type,
      actionName: action.name,
      actionConfig: action.config,
      status: 'pending',
    }));

    await prisma.workflowExecutionStep.createMany({
      data: steps,
    });

    return execution;
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(id: string) {
    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        template: true,
        steps: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!execution) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Workflow execution'), HTTP_STATUS.NOT_FOUND);
    }

    return execution;
  }

  /**
   * Get all executions with filtering
   */
  async getExecutions(options: GetExecutionsOptions = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      templateId,
    } = options;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (templateId) where.templateId = templateId;

    const [executions, total] = await Promise.all([
      prisma.workflowExecution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: SORT_ORDER.DESC },
        include: {
          template: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          _count: {
            select: { steps: true },
          },
        },
      }),
      prisma.workflowExecution.count({ where }),
    ]);

    return {
      executions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update execution status
   */
  async updateExecutionStatus(
    id: string,
    status: WorkflowExecutionStatus,
    error?: string
  ) {
    const updateData: Record<string, unknown> = { status };
    
    if (status === WorkflowExecutionStatus.COMPLETED || 
        status === WorkflowExecutionStatus.FAILED || 
        status === WorkflowExecutionStatus.CANCELLED) {
      updateData.completedAt = new Date();
    }
    
    if (error) {
      updateData.error = error;
    }

    const execution = await prisma.workflowExecution.update({
      where: { id },
      data: updateData,
    });

    return execution;
  }

  /**
   * Update execution variables
   */
  async updateExecutionVariables(id: string, variables: Record<string, unknown>) {
    const execution = await prisma.workflowExecution.update({
      where: { id },
      data: { variables },
    });

    return execution;
  }

  /**
   * Update current action
   */
  async updateCurrentAction(id: string, actionId: string) {
    const execution = await prisma.workflowExecution.update({
      where: { id },
      data: { currentActionId: actionId },
    });

    return execution;
  }

  /**
   * Start execution step
   */
  async startExecutionStep(executionId: string, actionId: string) {
    // Find the step
    const step = await prisma.workflowExecutionStep.findFirst({
      where: {
        executionId,
        actionId,
      },
    });

    if (!step) {
      throw new AppError('Execution step not found', HTTP_STATUS.NOT_FOUND);
    }

    const updatedStep = await prisma.workflowExecutionStep.update({
      where: { id: step.id },
      data: {
        status: 'running',
        startedAt: new Date(),
      },
    });

    return updatedStep;
  }

  /**
   * Complete execution step
   */
  async completeExecutionStep(
    executionId: string,
    actionId: string,
    status: 'success' | 'failed' | 'skipped',
    output?: Record<string, unknown>,
    error?: string
  ) {
    const step = await prisma.workflowExecutionStep.findFirst({
      where: {
        executionId,
        actionId,
      },
    });

    if (!step) {
      throw new AppError('Execution step not found', HTTP_STATUS.NOT_FOUND);
    }

    const updatedStep = await prisma.workflowExecutionStep.update({
      where: { id: step.id },
      data: {
        status,
        output,
        error,
        completedAt: new Date(),
      },
    });

    return updatedStep;
  }

  /**
   * Cancel execution
   */
  async cancelExecution(id: string) {
    await this.getExecutionById(id);

    const execution = await prisma.workflowExecution.update({
      where: { id },
      data: {
        status: WorkflowExecutionStatus.CANCELLED,
        completedAt: new Date(),
      },
    });

    // Cancel all pending steps
    await prisma.workflowExecutionStep.updateMany({
      where: {
        executionId: id,
        status: 'pending',
      },
      data: {
        status: 'skipped',
        completedAt: new Date(),
      },
    });

    return execution;
  }

  /**
   * Get execution statistics
   */
  async getExecutionStats(templateId?: string) {
    const where = templateId ? { templateId } : {};

    const [total, pending, running, completed, failed, cancelled] = await Promise.all([
      prisma.workflowExecution.count({ where }),
      prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.PENDING },
      }),
      prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.RUNNING },
      }),
      prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.COMPLETED },
      }),
      prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.FAILED },
      }),
      prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.CANCELLED },
      }),
    ]);

    const successRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      pending,
      running,
      completed,
      failed,
      cancelled,
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  /**
   * Get recent executions
   */
  async getRecentExecutions(limit = 10) {
    const executions = await prisma.workflowExecution.findMany({
      take: limit,
      orderBy: { startedAt: SORT_ORDER.DESC },
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return executions;
  }

  /**
   * Delete old executions (cleanup)
   */
  async deleteOldExecutions(daysOld = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.workflowExecution.deleteMany({
      where: {
        startedAt: {
          lt: cutoffDate,
        },
        status: {
          in: [
            WorkflowExecutionStatus.COMPLETED,
            WorkflowExecutionStatus.FAILED,
            WorkflowExecutionStatus.CANCELLED,
          ],
        },
      },
    });

    return result.count;
  }
}

export const workflowExecutionService = new WorkflowExecutionService();
