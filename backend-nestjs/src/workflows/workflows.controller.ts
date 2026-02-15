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
import { WorkflowService } from './workflows.service';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowService) {}
  /**
   * Create a new workflow
   */
  @Post()
  async createWorkflow(@Body() body: any) {
    const workflow = await this.workflowsService.createWorkflow(body);

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  @Get(':id')
  async getWorkflow(@Param('id', ParseUUIDPipe) id: string) {
    const workflow = await this.workflowsService.getWorkflowById(id);

    return workflow;
  }

  /**
   * Get all workflows
   */
  @Get()
  async getWorkflows(@Query() query: any) {
    const { page, limit, status, documentId } = query;

    const result = await this.workflowsService.getWorkflows({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      documentId: documentId as string | undefined,
    });

    return {
      workflows: result.workflows,
      pagination: result.pagination,
    };
  }

  /**
   * Update a workflow
   */
  @Put(':id')
  async updateWorkflow(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    const workflow = await this.workflowsService.updateWorkflow(id, body);

    return workflow;
  }

  /**
   * Advance workflow to next step
   */
  @Post(':id/advance')
  async advanceWorkflow(@Param('id', ParseUUIDPipe) id: string) {
    const workflow = await this.workflowsService.advanceWorkflow(id);

    return workflow;
  }

  /**
   * Cancel a workflow
   */
  @Post(':id/cancel')
  async cancelWorkflow(@Param('id', ParseUUIDPipe) id: string) {
    const workflow = await this.workflowsService.cancelWorkflow(id);

    return workflow;
  }

  /**
   * Get workflow statistics
   */
  @Get('stats')
  async getWorkflowStats() {
    const stats = await this.workflowsService.getWorkflowStats();

    return stats;
  }

  /**
   * Get workflows by document ID
   */
  @Get('document/:documentId')
  async getWorkflowsByDocument(@Param('documentId', ParseUUIDPipe) documentId: string) {
    const workflows = await this.workflowsService.getWorkflowsByDocumentId(documentId);

    return workflows;
  }
}

