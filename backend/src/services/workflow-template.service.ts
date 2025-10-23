import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, SORT_ORDER } from '../constants';
import {
  WorkflowTriggerType,
  WorkflowActionType,
  WorkflowAction,
} from '../types/workflow-types';

interface CreateWorkflowTemplateData {
  name: string;
  description?: string;
  category?: string;
  triggerType: WorkflowTriggerType;
  triggerConfig: Record<string, unknown>;
  actions: WorkflowAction[];
  isPublic?: boolean;
}

interface UpdateWorkflowTemplateData {
  name?: string;
  description?: string;
  category?: string;
  triggerType?: WorkflowTriggerType;
  triggerConfig?: Record<string, unknown>;
  actions?: WorkflowAction[];
  isActive?: boolean;
  isPublic?: boolean;
}

interface GetTemplatesOptions {
  page?: number;
  limit?: number;
  category?: string;
  triggerType?: string;
  isActive?: boolean;
}

export class WorkflowTemplateService {
  /**
   * Create a new workflow template
   */
  async createTemplate(data: CreateWorkflowTemplateData) {
    // Validate actions array
    if (!data.actions || data.actions.length === 0) {
      throw new AppError('At least one action must be defined', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate action IDs are unique
    const actionIds = data.actions.map((a) => a.id);
    const uniqueIds = new Set(actionIds);
    if (actionIds.length !== uniqueIds.size) {
      throw new AppError('Action IDs must be unique', HTTP_STATUS.BAD_REQUEST);
    }

    const template = await prisma.workflowTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category || 'general',
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        actions: data.actions,
        isPublic: data.isPublic ?? false,
        isActive: true,
      },
    });

    return template;
  }

  /**
   * Get workflow template by ID
   */
  async getTemplateById(id: string) {
    const template = await prisma.workflowTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });

    if (!template) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND('Workflow template'), HTTP_STATUS.NOT_FOUND);
    }

    return template;
  }

  /**
   * Get all workflow templates with filtering
   */
  async getTemplates(options: GetTemplatesOptions = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      triggerType,
      isActive,
    } = options;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (triggerType) where.triggerType = triggerType;
    if (isActive !== undefined) where.isActive = isActive;

    const [templates, total] = await Promise.all([
      prisma.workflowTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { usageCount: SORT_ORDER.DESC },
        include: {
          _count: {
            select: { executions: true },
          },
        },
      }),
      prisma.workflowTemplate.count({ where }),
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update workflow template
   */
  async updateTemplate(id: string, data: UpdateWorkflowTemplateData) {
    await this.getTemplateById(id);

    // Validate actions if provided
    if (data.actions) {
      if (data.actions.length === 0) {
        throw new AppError('At least one action must be defined', HTTP_STATUS.BAD_REQUEST);
      }

      const actionIds = data.actions.map((a) => a.id);
      const uniqueIds = new Set(actionIds);
      if (actionIds.length !== uniqueIds.size) {
        throw new AppError('Action IDs must be unique', HTTP_STATUS.BAD_REQUEST);
      }
    }

    const template = await prisma.workflowTemplate.update({
      where: { id },
      data,
    });

    return template;
  }

  /**
   * Delete workflow template
   */
  async deleteTemplate(id: string): Promise<void> {
    await this.getTemplateById(id);

    await prisma.workflowTemplate.delete({
      where: { id },
    });
  }

  /**
   * Increment template usage count
   */
  async incrementUsageCount(id: string) {
    const template = await prisma.workflowTemplate.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });

    return template;
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit = 10) {
    const templates = await prisma.workflowTemplate.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      take: limit,
      orderBy: { usageCount: SORT_ORDER.DESC },
    });

    return templates;
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string) {
    const templates = await prisma.workflowTemplate.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { usageCount: SORT_ORDER.DESC },
    });

    return templates;
  }

  /**
   * Get template categories
   */
  async getCategories() {
    const templates = await prisma.workflowTemplate.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return templates.map((t: { category: string }) => t.category);
  }

  /**
   * Validate workflow template structure
   */
  validateTemplateStructure(template: {
    triggerType: string;
    triggerConfig: Record<string, unknown>;
    actions: WorkflowAction[];
  }): boolean {
    // Validate trigger
    if (!Object.values(WorkflowTriggerType).includes(template.triggerType as WorkflowTriggerType)) {
      throw new AppError('Invalid trigger type', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate actions
    for (const action of template.actions) {
      if (!Object.values(WorkflowActionType).includes(action.type)) {
        throw new AppError(`Invalid action type: ${action.type}`, HTTP_STATUS.BAD_REQUEST);
      }

      if (!action.id || !action.name) {
        throw new AppError('Action must have id and name', HTTP_STATUS.BAD_REQUEST);
      }
    }

    return true;
  }
}

export const workflowTemplateService = new WorkflowTemplateService();
