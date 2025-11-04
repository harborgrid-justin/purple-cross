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
  async createWorkflow(req: Request, res: Response) {
    const workflow = await workflowService.createWorkflow(body);

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(req: Request, res: Response) {
    const workflow = await workflowService.getWorkflowById(id);

    return workflow;
  }

  /**
   * Get all workflows
   */
  async getWorkflows(req: Request, res: Response) {
    const { page, limit, status, documentId } = query;

    const result = await workflowService.getWorkflows({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      documentId: documentId as string | undefined,
    });

    return result.workflows,
      pagination: result.pagination,
    ;
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(req: Request, res: Response) {
    const workflow = await workflowService.updateWorkflow(id, body);

    return workflow;
  }

  /**
   * Advance workflow to next step
   */
  async advanceWorkflow(req: Request, res: Response) {
    const workflow = await workflowService.advanceWorkflow(id);

    return workflow;
  }

  /**
   * Cancel a workflow
   */
  async cancelWorkflow(req: Request, res: Response) {
    const workflow = await workflowService.cancelWorkflow(id);

    return workflow;
  }

  /**
   * Get workflow statistics
   */
  async getWorkflowStats(_req: Request, res: Response) {
    const stats = await workflowService.getWorkflowStats();

    return stats;
  }

  /**
   * Get workflows by document ID
   */
  async getWorkflowsByDocument(req: Request, res: Response) {
    const workflows = await workflowService.getWorkflowsByDocumentId(FIXME_documentId);

    return workflows;
  }
}

