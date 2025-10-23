import { logger } from '../config/logger';
import { workflowExecutionService } from './workflow-execution.service';
import { workflowTemplateService } from './workflow-template.service';
import {
  WorkflowAction,
  WorkflowActionType,
  WorkflowExecutionStatus,
  WorkflowCondition,
  ConditionOperator,
} from '../types/workflow-types';

/**
 * Workflow Engine Service
 * Executes workflow actions and handles conditional logic
 */
export class WorkflowEngineService {
  /**
   * Execute a workflow from a template
   */
  async executeWorkflowFromTemplate(
    templateId: string,
    triggerData: Record<string, unknown>
  ) {
    const template = await workflowTemplateService.getTemplateById(templateId);

    if (!template.isActive) {
      throw new Error('Workflow template is not active');
    }

    // Increment usage count
    await workflowTemplateService.incrementUsageCount(templateId);

    // Start execution
    const execution = await workflowExecutionService.startExecution({
      templateId: template.id,
      workflowName: template.name,
      triggerType: template.triggerType,
      triggerData,
      actions: template.actions as WorkflowAction[],
    });

    // Queue execution for processing
    await this.processExecution(execution.id);

    return execution;
  }

  /**
   * Execute a workflow without a template
   */
  async executeWorkflow(
    workflowName: string,
    triggerType: string,
    triggerData: Record<string, unknown>,
    actions: WorkflowAction[]
  ) {
    const execution = await workflowExecutionService.startExecution({
      workflowName,
      triggerType,
      triggerData,
      actions,
    });

    await this.processExecution(execution.id);

    return execution;
  }

  /**
   * Process workflow execution
   */
  async processExecution(executionId: string) {
    try {
      const execution = await workflowExecutionService.getExecutionById(executionId);

      if (execution.status !== WorkflowExecutionStatus.PENDING) {
        logger.warn('Execution is not in pending state', { executionId });
        return;
      }

      // Update status to running
      await workflowExecutionService.updateExecutionStatus(
        executionId,
        WorkflowExecutionStatus.RUNNING
      );

      // Get execution steps
      const steps = execution.steps || [];
      const variables = (execution.variables as Record<string, unknown>) || {};

      // Group steps by parallel execution groups
      const executionGroups = this.groupStepsByParallelExecution(steps);

      // Execute each group
      for (const group of executionGroups) {
        try {
          // Execute all steps in the group in parallel
          const results = await Promise.allSettled(
            group.map(async (step) => {
              // Start step
              await workflowExecutionService.startExecutionStep(executionId, step.actionId);

              // Execute action
              const actionConfig = step.actionConfig as Record<string, unknown>;
              const result = await this.executeAction(
                step.actionType,
                actionConfig,
                variables,
                execution.triggerData as Record<string, unknown>
              );

              // Complete step
              await workflowExecutionService.completeExecutionStep(
                executionId,
                step.actionId,
                result.success ? 'success' : 'failed',
                result.output,
                result.error
              );

              return { step, result };
            })
          );

          // Process results and update variables
          for (const settledResult of results) {
            if (settledResult.status === 'fulfilled') {
              const { result } = settledResult.value;
              
              if (result.output) {
                Object.assign(variables, result.output);
              }

              if (!result.success) {
                throw new Error(result.error || 'Action execution failed');
              }
            } else {
              // Handle rejected promise
              const error = settledResult.reason;
              logger.error('Step execution failed', {
                executionId,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              throw error;
            }
          }

          // Update variables after group execution
          await workflowExecutionService.updateExecutionVariables(executionId, variables);
        } catch (error) {
          logger.error('Group execution failed', {
            executionId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });

          // Fail the execution
          throw error;
        }
      }

      // All steps completed successfully
      await workflowExecutionService.updateExecutionStatus(
        executionId,
        WorkflowExecutionStatus.COMPLETED
      );

      logger.info('Workflow execution completed', { executionId });
    } catch (error) {
      logger.error('Workflow execution failed', {
        executionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      await workflowExecutionService.updateExecutionStatus(
        executionId,
        WorkflowExecutionStatus.FAILED,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Group steps by parallel execution
   * Steps with isParallel=true are grouped together if they have no dependencies
   */
  private groupStepsByParallelExecution(steps: any[]): any[][] {
    const groups: any[][] = [];

    // For simplicity, we'll group consecutive parallel steps together
    let currentGroup: any[] = [];
    
    for (const step of steps) {
      const config = step.actionConfig as Record<string, unknown>;
      const isParallel = config.isParallel === true;

      if (isParallel && currentGroup.length > 0) {
        // Check if the last action in current group is also parallel
        const lastConfig = currentGroup[currentGroup.length - 1].actionConfig as Record<string, unknown>;
        if (lastConfig.isParallel === true) {
          // Add to current parallel group
          currentGroup.push(step);
          continue;
        }
      }

      // Start new group or add to sequential group
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
      
      currentGroup.push(step);
      
      // If not parallel, immediately close the group
      if (!isParallel) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    }

    // Add remaining group
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * Execute a workflow action
   */
  private async executeAction(
    actionType: string,
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    try {
      switch (actionType) {
        case WorkflowActionType.SEND_EMAIL:
          return await this.executeSendEmail(config, variables, triggerData);

        case WorkflowActionType.SEND_NOTIFICATION:
          return await this.executeSendNotification(config, variables, triggerData);

        case WorkflowActionType.UPDATE_RECORD:
          return await this.executeUpdateRecord(config, variables, triggerData);

        case WorkflowActionType.CREATE_RECORD:
          return await this.executeCreateRecord(config, variables, triggerData);

        case WorkflowActionType.WEBHOOK:
          return await this.executeWebhook(config, variables, triggerData);

        case WorkflowActionType.WAIT:
          return await this.executeWait(config);

        case WorkflowActionType.CONDITION:
          return await this.executeCondition(config, variables, triggerData);

        default:
          return {
            success: false,
            error: `Unknown action type: ${actionType}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send email action
   */
  private async executeSendEmail(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    // TODO: Implement email sending via email service
    logger.info('Send email action', { config, variables, triggerData });

    return {
      success: true,
      output: {
        emailSent: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Send notification action
   */
  private async executeSendNotification(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    // TODO: Implement notification sending
    logger.info('Send notification action', { config, variables, triggerData });

    return {
      success: true,
      output: {
        notificationSent: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Update record action
   */
  private async executeUpdateRecord(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    // TODO: Implement record update via Prisma
    logger.info('Update record action', { config, variables, triggerData });

    return {
      success: true,
      output: {
        recordUpdated: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Create record action
   */
  private async executeCreateRecord(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    // TODO: Implement record creation via Prisma
    logger.info('Create record action', { config, variables, triggerData });

    return {
      success: true,
      output: {
        recordCreated: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Webhook action
   */
  private async executeWebhook(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    // TODO: Implement webhook call
    logger.info('Webhook action', { config, variables, triggerData });

    return {
      success: true,
      output: {
        webhookCalled: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Wait action
   */
  private async executeWait(
    config: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    const duration = (config.duration as number) || 0;

    if (duration > 0) {
      await new Promise((resolve) => setTimeout(resolve, duration));
    }

    return {
      success: true,
      output: {
        waited: duration,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Condition action - evaluates conditions
   */
  private async executeCondition(
    config: Record<string, unknown>,
    variables: Record<string, unknown>,
    triggerData: Record<string, unknown>
  ): Promise<{ success: boolean; output?: Record<string, unknown>; error?: string }> {
    const conditions = config.conditions as WorkflowCondition[];
    
    if (!conditions || conditions.length === 0) {
      return { success: true, output: { conditionMet: true } };
    }

    const allData = { ...variables, ...triggerData };
    let result = true;

    for (const condition of conditions) {
      const fieldValue = allData[condition.field];
      const conditionResult = this.evaluateCondition(
        fieldValue,
        condition.operator,
        condition.value
      );

      if (condition.logicalOperator === 'OR') {
        result = result || conditionResult;
      } else {
        result = result && conditionResult;
      }
    }

    return {
      success: true,
      output: {
        conditionMet: result,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    fieldValue: unknown,
    operator: ConditionOperator,
    compareValue: unknown
  ): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return fieldValue === compareValue;

      case ConditionOperator.NOT_EQUALS:
        return fieldValue !== compareValue;

      case ConditionOperator.GREATER_THAN:
        return Number(fieldValue) > Number(compareValue);

      case ConditionOperator.LESS_THAN:
        return Number(fieldValue) < Number(compareValue);

      case ConditionOperator.CONTAINS:
        return String(fieldValue).includes(String(compareValue));

      case ConditionOperator.NOT_CONTAINS:
        return !String(fieldValue).includes(String(compareValue));

      case ConditionOperator.IS_EMPTY:
        return !fieldValue || fieldValue === '';

      case ConditionOperator.IS_NOT_EMPTY:
        return !!fieldValue && fieldValue !== '';

      default:
        return false;
    }
  }
}

export const workflowEngineService = new WorkflowEngineService();
