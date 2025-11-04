import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

@Injectable()
export class WorkflowTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /**
   * Create a new workflow template
   */
  async createTemplate(data: CreateWorkflowTemplateData) {
    // Validate actions array
    if (!data.actions || data.actions.length === 0) {
      throw new BadRequestException('At least one action must be defined');
    }

    // Validate action IDs are unique
    const actionIds = data.actions.map((a) => a.id);
    const uniqueIds = new Set(actionIds);
    if (actionIds.length !== uniqueIds.size) {
      throw new BadRequestException('Action IDs must be unique');
    }

    const template = await this.prisma.workflowTemplate.create({
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
    const template = await this.prisma.workflowTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND('Workflow template'));
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
      this.prisma.workflowTemplate.findMany({
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
      this.prisma.workflowTemplate.count({ where }),
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
        throw new BadRequestException('At least one action must be defined');
      }

      const actionIds = data.actions.map((a) => a.id);
      const uniqueIds = new Set(actionIds);
      if (actionIds.length !== uniqueIds.size) {
        throw new BadRequestException('Action IDs must be unique');
      }
    }

    const template = await this.prisma.workflowTemplate.update({
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

    await this.prisma.workflowTemplate.delete({
      where: { id },
    });
  }

  /**
   * Increment template usage count
   */
  async incrementUsageCount(id: string) {
    const template = await this.prisma.workflowTemplate.update({
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
    const templates = await this.prisma.workflowTemplate.findMany({
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
    const templates = await this.prisma.workflowTemplate.findMany({
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
    const templates = await this.prisma.workflowTemplate.findMany({
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
      throw new BadRequestException('Invalid trigger type');
    }

    // Validate actions
    for (const action of template.actions) {
      if (!Object.values(WorkflowActionType).includes(action.type)) {
        throw new BadRequestException(`Invalid action type: ${action.type}`);
      }

      if (!action.id || !action.name) {
        throw new BadRequestException('Action must have id and name');
      }
    }

    return true;
  }
}

