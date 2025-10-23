import { Request, Response } from 'express';
import { workflowTemplateService } from '../services/workflow-template.service';
import { HTTP_STATUS } from '../constants';

export class WorkflowTemplateController {
  /**
   * Create a new workflow template
   */
  async createTemplate(req: Request, res: Response): Promise<void> {
    const template = await workflowTemplateService.createTemplate(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: template,
    });
  }

  /**
   * Get template by ID
   */
  async getTemplate(req: Request, res: Response): Promise<void> {
    const template = await workflowTemplateService.getTemplateById(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: template,
    });
  }

  /**
   * Get all templates
   */
  async getTemplates(req: Request, res: Response): Promise<void> {
    const { page, limit, category, triggerType, isActive } = req.query;

    const result = await workflowTemplateService.getTemplates({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string | undefined,
      triggerType: triggerType as string | undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.templates,
      pagination: result.pagination,
    });
  }

  /**
   * Update a template
   */
  async updateTemplate(req: Request, res: Response): Promise<void> {
    const template = await workflowTemplateService.updateTemplate(req.params.id, req.body);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: template,
    });
  }

  /**
   * Delete a template
   */
  async deleteTemplate(req: Request, res: Response): Promise<void> {
    await workflowTemplateService.deleteTemplate(req.params.id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;
    const templates = await workflowTemplateService.getPopularTemplates(
      limit ? parseInt(limit as string) : undefined
    );

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: templates,
    });
  }

  /**
   * Get template categories
   */
  async getCategories(_req: Request, res: Response): Promise<void> {
    const categories = await workflowTemplateService.getCategories();

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: categories,
    });
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(req: Request, res: Response): Promise<void> {
    const templates = await workflowTemplateService.getTemplatesByCategory(
      req.params.category
    );

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: templates,
    });
  }

  /**
   * Execute a template
   */
  async executeTemplate(req: Request, res: Response): Promise<void> {
    const { queueWorkflow } = await import('../jobs');

    await queueWorkflow({
      type: 'execute_template',
      templateId: req.params.id,
      triggerType: 'manual',
      triggerData: req.body.triggerData || {},
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Workflow template queued for execution',
      data: {
        templateId: req.params.id,
      },
    });
  }
}

export const workflowTemplateController = new WorkflowTemplateController();
