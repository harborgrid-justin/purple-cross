import { EventEmitter } from 'events';
import { logger } from '../config/logger';
import { workflowTemplateService } from './workflow-template.service';
import { workflowEngineService } from './workflow-engine.service';
import { WorkflowTriggerType } from '../types/workflow-types';

/**
 * Domain Event Types for Workflow Triggers
 * These events are emitted by domain services to trigger workflows
 */
export const WORKFLOW_EVENTS = {
  // Patient events
  PATIENT_CREATED: 'patient.created',
  PATIENT_UPDATED: 'patient.updated',
  PATIENT_DELETED: 'patient.deleted',

  // Client events
  CLIENT_CREATED: 'client.created',
  CLIENT_UPDATED: 'client.updated',
  CLIENT_DELETED: 'client.deleted',

  // Appointment events
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_UPDATED: 'appointment.updated',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
  APPOINTMENT_COMPLETED: 'appointment.completed',

  // Invoice events
  INVOICE_CREATED: 'invoice.created',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_OVERDUE: 'invoice.overdue',

  // Medical Record events
  MEDICAL_RECORD_CREATED: 'medical_record.created',
  MEDICAL_RECORD_UPDATED: 'medical_record.updated',

  // Lab Test events
  LAB_TEST_ORDERED: 'lab_test.ordered',
  LAB_TEST_COMPLETED: 'lab_test.completed',

  // Prescription events
  PRESCRIPTION_CREATED: 'prescription.created',
  PRESCRIPTION_REFILLED: 'prescription.refilled',
} as const;

export type WorkflowEventType = (typeof WORKFLOW_EVENTS)[keyof typeof WORKFLOW_EVENTS];

/**
 * Workflow Trigger Service
 * Listens to domain events and triggers matching workflow templates
 */
class WorkflowTriggerService extends EventEmitter {
  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * Set up event handlers for all workflow events
   */
  private setupEventHandlers(): void {
    // Listen to all events and trigger matching workflows
    Object.values(WORKFLOW_EVENTS).forEach((event) => {
      this.on(event, async (data: Record<string, unknown>) => {
        await this.triggerWorkflows(event, data);
      });
    });
  }

  /**
   * Trigger workflows for a specific event
   */
  private async triggerWorkflows(event: string, data: Record<string, unknown>): Promise<void> {
    try {
      // Find all active workflow templates for this event trigger
      const { templates } = await workflowTemplateService.getTemplates({
        triggerType: WorkflowTriggerType.EVENT,
        isActive: true,
      });

      if (templates.length === 0) {
        logger.debug('No workflow templates found for event', { event });
        return;
      }

      // Filter templates that match this specific event
      const matchingTemplates = templates.filter((template: { triggerConfig: unknown }) => {
        const triggerConfig = template.triggerConfig as { event?: string };
        return triggerConfig.event === event;
      });

      if (matchingTemplates.length === 0) {
        logger.debug('No matching workflow templates for event', { event });
        return;
      }

      // Execute each matching workflow template
      const promises = matchingTemplates.map(async (template: { id: string; name: string }) => {
        try {
          await workflowEngineService.executeWorkflowFromTemplate(template.id, data);
          logger.info('Workflow triggered successfully', {
            event,
            templateId: template.id,
            templateName: template.name,
          });
        } catch (error) {
          logger.error('Failed to trigger workflow', {
            event,
            templateId: template.id,
            templateName: template.name,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.allSettled(promises);

      logger.info('Workflows triggered for event', {
        event,
        count: matchingTemplates.length,
      });
    } catch (error) {
      logger.error('Error triggering workflows', {
        event,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Emit a workflow event
   */
  emitWorkflowEvent(event: WorkflowEventType, data: Record<string, unknown>): void {
    this.emit(event, data);
    logger.debug('Workflow event emitted', { event, data });
  }

  /**
   * Get all available workflow events
   */
  getAvailableEvents(): string[] {
    return Object.values(WORKFLOW_EVENTS);
  }
}

// Export singleton instance
export const workflowTriggerService = new WorkflowTriggerService();
