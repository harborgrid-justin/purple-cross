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
  @Post()
  async createTemplate(@Body() body: any) {
    const template = await this.workflowTemplatesService.createTemplate(body);

    return template;
  }

  /**
   * Get template by ID
   */
  @Get(':id')
  async getTemplate(@Param('id', ParseUUIDPipe) id: string) {
    const template = await this.workflowTemplatesService.getTemplateById(id);

    return template;
  }

  /**
   * Get all templates
   */
  @Get()
  async getTemplates(@Query() query: any) {
    const { page, limit, category, triggerType, isActive } = query;

    const result = await this.workflowTemplatesService.getTemplates({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string | undefined,
      triggerType: triggerType as string | undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });

    return {
      templates: result.templates,
      pagination: result.pagination,
    };
  }

  /**
   * Update a template
   */
  @Put(':id')
  async updateTemplate(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const template = await this.workflowTemplatesService.updateTemplate(id, body);

    return template;
  }

  /**
   * Delete a template
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(@Param('id', ParseUUIDPipe) id: string) {
    await this.workflowTemplatesService.deleteTemplate(id);
  }

  /**
   * Get popular templates
   */
  @Get('popular')
  async getPopularTemplates(@Query() query: any) {
    const { limit } = query;
    const templates = await this.workflowTemplatesService.getPopularTemplates(
      limit ? parseInt(limit as string) : undefined
    );

    return templates;
  }

  /**
   * Get template categories
   */
  @Get('categories')
  async getCategories() {
    const categories = await this.workflowTemplatesService.getCategories();

    return categories;
  }

  /**
   * Get templates by category
   */
  @Get('category/:category')
  async getTemplatesByCategory(@Param('category') category: string) {
    const templates = await this.workflowTemplatesService.getTemplatesByCategory(
      category
    );

    return templates;
  }

  /**
   * Execute a template
   */
  @Post(':id/execute')
  async executeTemplate(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const { queueWorkflow } = await import('../jobs.js');

    await queueWorkflow({
      type: 'execute_template',
      templateId: id,
      triggerType: 'manual',
      triggerData: body.triggerData || {},
    });

    return {
      status: 'success',
      message: 'Workflow template queued for execution',
      data: {
        templateId: id,
      },
    };
  }
}

