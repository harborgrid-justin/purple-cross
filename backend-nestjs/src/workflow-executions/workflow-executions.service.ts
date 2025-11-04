import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

@Injectable()
export class WorkflowExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /**
   * Start a new workflow execution
   */
  async startExecution(data: StartExecutionData) {
    const execution = await this.prisma.workflowExecution.create({
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

    await this.prisma.workflowExecutionStep.createMany({
      data: steps,
    });

    return execution;
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(id: string) {
    const execution = await this.prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        template: true,
        steps: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Workflow execution'));
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
      this.prisma.workflowExecution.findMany({
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
      this.prisma.workflowExecution.count({ where }),
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

    const execution = await this.prisma.workflowExecution.update({
      where: { id },
      data: updateData,
    });

    return execution;
  }

  /**
   * Update execution variables
   */
  async updateExecutionVariables(id: string, variables: Record<string, unknown>) {
    const execution = await this.prisma.workflowExecution.update({
      where: { id },
      data: { variables },
    });

    return execution;
  }

  /**
   * Update current action
   */
  async updateCurrentAction(id: string, actionId: string) {
    const execution = await this.prisma.workflowExecution.update({
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
    const step = await this.prisma.workflowExecutionStep.findFirst({
      where: {
        executionId,
        actionId,
      },
    });

    if (!step) {
      throw new BadRequestException('Execution step not found');
    }

    const updatedStep = await this.prisma.workflowExecutionStep.update({
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
    const step = await this.prisma.workflowExecutionStep.findFirst({
      where: {
        executionId,
        actionId,
      },
    });

    if (!step) {
      throw new BadRequestException('Execution step not found');
    }

    const updatedStep = await this.prisma.workflowExecutionStep.update({
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

    const execution = await this.prisma.workflowExecution.update({
      where: { id },
      data: {
        status: WorkflowExecutionStatus.CANCELLED,
        completedAt: new Date(),
      },
    });

    // Cancel all pending steps
    await this.prisma.workflowExecutionStep.updateMany({
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
      this.prisma.workflowExecution.count({ where }),
      this.prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.PENDING },
      }),
      this.prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.RUNNING },
      }),
      this.prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.COMPLETED },
      }),
      this.prisma.workflowExecution.count({
        where: { ...where, status: WorkflowExecutionStatus.FAILED },
      }),
      this.prisma.workflowExecution.count({
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
    const executions = await this.prisma.workflowExecution.findMany({
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

    const result = await this.prisma.workflowExecution.deleteMany({
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