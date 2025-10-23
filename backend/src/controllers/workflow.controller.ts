import { Request, Response } from 'express';
import { workflowService } from '../services/workflow.service';
import { HTTP_STATUS } from '../constants';

export class WorkflowController {
  /**
   * Create a new workflow
   */
  async createWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await workflowService.createWorkflow(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data: workflow,
    });
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await workflowService.getWorkflowById(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: workflow,
    });
  }

  /**
   * Get all workflows
   */
  async getWorkflows(req: Request, res: Response): Promise<void> {
    const { page, limit, status, documentId } = req.query;

    const result = await workflowService.getWorkflows({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      documentId: documentId as string | undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.workflows,
      pagination: result.pagination,
    });
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await workflowService.updateWorkflow(req.params.id, req.body);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: workflow,
    });
  }

  /**
   * Advance workflow to next step
   */
  async advanceWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await workflowService.advanceWorkflow(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: workflow,
    });
  }

  /**
   * Cancel a workflow
   */
  async cancelWorkflow(req: Request, res: Response): Promise<void> {
    const workflow = await workflowService.cancelWorkflow(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: workflow,
    });
  }

  /**
   * Get workflow statistics
   */
  async getWorkflowStats(_req: Request, res: Response): Promise<void> {
    const stats = await workflowService.getWorkflowStats();

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: stats,
    });
  }

  /**
   * Get workflows by document ID
   */
  async getWorkflowsByDocument(req: Request, res: Response): Promise<void> {
    const workflows = await workflowService.getWorkflowsByDocumentId(req.params.documentId);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: workflows,
    });
  }
}

export const workflowController = new WorkflowController();
