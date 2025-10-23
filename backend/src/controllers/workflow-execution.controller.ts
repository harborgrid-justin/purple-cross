import { Request, Response } from 'express';
import { workflowExecutionService } from '../services/workflow-execution.service';
import { HTTP_STATUS } from '../constants';

export class WorkflowExecutionController {
  /**
   * Get execution by ID
   */
  async getExecution(req: Request, res: Response): Promise<void> {
    const execution = await workflowExecutionService.getExecutionById(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: execution,
    });
  }

  /**
   * Get all executions
   */
  async getExecutions(req: Request, res: Response): Promise<void> {
    const { page, limit, status, templateId } = req.query;

    const result = await workflowExecutionService.getExecutions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      templateId: templateId as string | undefined,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.executions,
      pagination: result.pagination,
    });
  }

  /**
   * Cancel an execution
   */
  async cancelExecution(req: Request, res: Response): Promise<void> {
    const execution = await workflowExecutionService.cancelExecution(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: execution,
    });
  }

  /**
   * Get execution statistics
   */
  async getExecutionStats(req: Request, res: Response): Promise<void> {
    const { templateId } = req.query;

    const stats = await workflowExecutionService.getExecutionStats(
      templateId as string | undefined
    );

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: stats,
    });
  }

  /**
   * Get recent executions
   */
  async getRecentExecutions(req: Request, res: Response): Promise<void> {
    const { limit } = req.query;

    const executions = await workflowExecutionService.getRecentExecutions(
      limit ? parseInt(limit as string) : undefined
    );

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: executions,
    });
  }

  /**
   * Execute a custom workflow
   */
  async executeCustomWorkflow(req: Request, res: Response): Promise<void> {
    const { queueWorkflow } = await import('../jobs');
    const { workflowName, actions, triggerData } = req.body;

    await queueWorkflow({
      type: 'execute_custom',
      workflowName,
      triggerType: 'manual',
      triggerData: triggerData || {},
      actions,
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Custom workflow queued for execution',
      data: {
        workflowName,
      },
    });
  }
}

export const workflowExecutionController = new WorkflowExecutionController();
