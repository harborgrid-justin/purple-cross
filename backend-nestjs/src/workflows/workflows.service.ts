import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface CreateWorkflowData {
  documentId: string;
  workflowName: string;
  steps: Record<string, unknown>;
  currentStep?: number;
  totalSteps: number;
}

interface UpdateWorkflowData {
  currentStep?: number;
  status?: string;
  steps?: Record<string, unknown>;
}

interface GetWorkflowsOptions {
  page?: number;
  limit?: number;
  status?: string;
  documentId?: string;
}

@Injectable()
export class WorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /**
   * Create a new workflow instance
   */
  async createWorkflow(data: CreateWorkflowData) {
    const workflow = await this.prisma.documentWorkflow.create({
      data: {
        documentId: data.documentId,
        workflowName: data.workflowName,
        currentStep: data.currentStep || 1,
        totalSteps: data.totalSteps,
        steps: data.steps,
        status: 'in_progress',
      },
    });

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  async getWorkflowById(id: string) {
    const workflow = await this.prisma.documentWorkflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Workflow'));
    }

    return workflow;
  }

  /**
   * Get all workflows with optional filtering
   */
  async getWorkflows(options: GetWorkflowsOptions = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      documentId,
    } = options;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (documentId) where.documentId = documentId;

    const [workflows, total] = await Promise.all([
      this.prisma.documentWorkflow.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
      }),
      this.prisma.documentWorkflow.count({ where }),
    ]);

    return {
      workflows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(id: string, data: UpdateWorkflowData) {
    // Check if workflow exists
    await this.getWorkflowById(id);

    const workflow = await this.prisma.documentWorkflow.update({
      where: { id },
      data,
    });

    return workflow;
  }

  /**
   * Advance workflow to next step
   */
  async advanceWorkflow(id: string) {
    const workflow = await this.getWorkflowById(id);

    if (workflow.currentStep >= workflow.totalSteps) {
      throw new BadRequestException('Workflow already completed');
    }

    const updatedWorkflow = await this.prisma.documentWorkflow.update({
      where: { id },
      data: {
        currentStep: workflow.currentStep + 1,
        status: workflow.currentStep + 1 >= workflow.totalSteps ? 'completed' : workflow.status,
        completedAt: workflow.currentStep + 1 >= workflow.totalSteps ? new Date() : undefined,
      },
    });

    return updatedWorkflow;
  }

  /**
   * Cancel a workflow
   */
  async cancelWorkflow(id: string) {
    await this.getWorkflowById(id);

    const workflow = await this.prisma.documentWorkflow.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });

    return workflow;
  }

  /**
   * Get workflow statistics
   */
  async getWorkflowStats() {
    const [total, inProgress, completed, cancelled] = await Promise.all([
      this.prisma.documentWorkflow.count(),
      this.prisma.documentWorkflow.count({ where: { status: 'in_progress' } }),
      this.prisma.documentWorkflow.count({ where: { status: 'completed' } }),
      this.prisma.documentWorkflow.count({
        where: { status: { in: ['cancelled', 'failed'] } },
      }),
    ]);

    return {
      total,
      inProgress,
      completed,
      cancelled,
    };
  }

  /**
   * Get workflows by document ID
   */
  async getWorkflowsByDocumentId(documentId: string) {
    const workflows = await this.prisma.documentWorkflow.findMany({
      where: { documentId },
      orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC },
    });

    return workflows;
  }
}

