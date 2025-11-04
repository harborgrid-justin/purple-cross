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
import { WorkflowExecutionService } from './workflow-executions.service';

@Controller('workflow-executions')
export class WorkflowExecutionsController {
  constructor(private readonly workflowExecutionsService: WorkflowExecutionService) {}
  /**
   * Get execution by ID
   */
  async getExecution(req: Request, res: Response) {
    const execution = await workflowExecutionService.getExecutionById(id);

    return execution;
  }

  /**
   * Get all executions
   */
  async getExecutions(req: Request, res: Response) {
    const { page, limit, status, templateId } = query;

    const result = await workflowExecutionService.getExecutions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      templateId: templateId as string | undefined,
    });

    return result.executions,
      pagination: result.pagination,
    ;
  }

  /**
   * Cancel an execution
   */
  async cancelExecution(req: Request, res: Response) {
    const execution = await workflowExecutionService.cancelExecution(id);

    return execution;
  }

  /**
   * Get execution statistics
   */
  async getExecutionStats(req: Request, res: Response) {
    const { templateId } = query;

    const stats = await workflowExecutionService.getExecutionStats(
      templateId as string | undefined
    );

    return stats;
  }

  /**
   * Get recent executions
   */
  async getRecentExecutions(req: Request, res: Response) {
    const { limit } = query;

    const executions = await workflowExecutionService.getRecentExecutions(
      limit ? parseInt(limit as string) : undefined
    );

    return executions;
  }

  /**
   * Execute a custom workflow
   */
  async executeCustomWorkflow(req: Request, res: Response) {
    const { queueWorkflow } = await import('../jobs');
    const { workflowName, actions, triggerData } = body;

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