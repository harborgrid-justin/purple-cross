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
  @Get(':id')
  async getExecution(@Param('id', ParseUUIDPipe) id: string) {
    const execution = await this.workflowExecutionsService.getExecutionById(id);

    return execution;
  }

  /**
   * Get all executions
   */
  @Get()
  async getExecutions(@Query() query: any) {
    const { page, limit, status, templateId } = query;

    const result = await this.workflowExecutionsService.getExecutions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string | undefined,
      templateId: templateId as string | undefined,
    });

    return {
      executions: result.executions,
      pagination: result.pagination,
    };
  }

  /**
   * Cancel an execution
   */
  @Post(':id/cancel')
  async cancelExecution(@Param('id', ParseUUIDPipe) id: string) {
    const execution = await this.workflowExecutionsService.cancelExecution(id);

    return execution;
  }

  /**
   * Get execution statistics
   */
  @Get('stats')
  async getExecutionStats(@Query() query: any) {
    const { templateId } = query;

    const stats = await this.workflowExecutionsService.getExecutionStats(
      templateId as string | undefined
    );

    return stats;
  }

  /**
   * Get recent executions
   */
  @Get('recent')
  async getRecentExecutions(@Query() query: any) {
    const { limit } = query;

    const executions = await this.workflowExecutionsService.getRecentExecutions(
      limit ? parseInt(limit as string) : undefined
    );

    return executions;
  }

  /**
   * Execute a custom workflow
   */
  @Post('custom/execute')
  async executeCustomWorkflow(@Body() body: any) {
    const { queueWorkflow } = await import('../jobs.js');
    const { workflowName, actions, triggerData } = body;

    await queueWorkflow({
      type: 'execute_custom',
      workflowName,
      triggerType: 'manual',
      triggerData: triggerData || {},
      actions,
    });

    return {
      status: 'success',
      message: 'Custom workflow queued for execution',
      data: {
        workflowName,
      },
    };
  }
}

