import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { WorkflowTemplateService } from './workflow-templates.service';

@Controller('workflow-templates')
export class WorkflowTemplatesController {
  constructor(private readonly workflowTemplatesService: WorkflowTemplateService) {}
  /**
   * Create a new workflow template
   */
  async createTemplate(req: Request, res: Response) {
    const template = await workflowTemplateService.createTemplate(body);

    return template;
  }

  /**
   * Get template by ID
   */
  async getTemplate(req: Request, res: Response) {
    const template = await workflowTemplateService.getTemplateById(id);

    return template;
  }

  /**
   * Get all templates
   */
  async getTemplates(req: Request, res: Response) {
    const { page, limit, category, triggerType, isActive } = query;

    const result = await workflowTemplateService.getTemplates({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string | undefined,
      triggerType: triggerType as string | undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });

    return result.templates,
      pagination: result.pagination,
    ;
  }

  /**
   * Update a template
   */
  async updateTemplate(req: Request, res: Response) {
    const template = await workflowTemplateService.updateTemplate(id, body);

    return template;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(req: Request, res: Response) {
    await workflowTemplateService.deleteTemplate(id);

    return;
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(req: Request, res: Response) {
    const { limit } = query;
    const templates = await workflowTemplateService.getPopularTemplates(
      limit ? parseInt(limit as string) : undefined
    );

    return templates;
  }

  /**
   * Get template categories
   */
  async getCategories(_req: Request, res: Response) {
    const categories = await workflowTemplateService.getCategories();

    return categories;
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(req: Request, res: Response) {
    const templates = await workflowTemplateService.getTemplatesByCategory(
      FIXME_category
    );

    return templates;
  }

  /**
   * Execute a template
   */
  async executeTemplate(req: Request, res: Response) {
    const { queueWorkflow } = await import('../jobs');

    await queueWorkflow({
      type: 'execute_template',
      templateId: id,
      triggerType: 'manual',
      triggerData: body.triggerData || {},
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Workflow template queued for execution',
      data: {
        templateId: id,
      },
    });
  }
}

