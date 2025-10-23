import { webhookEvents } from './webhook-events.service';
import { workflowTriggerService } from './workflow-trigger.service';
import { WORKFLOW_EVENTS } from '../constants';

/**
 * Domain Events Service
 * Centralized service for emitting domain events that trigger both webhooks and workflows
 */
class DomainEventsService {
  /**
   * Emit a domain event to both webhooks and workflows
   */
  emit(event: string, data: Record<string, unknown>): void {
    // Emit to webhook system
    webhookEvents.emitWebhookEvent(event as any, data);

    // Emit to workflow system
    workflowTriggerService.emitWorkflowEvent(event as any, data);
  }

  /**
   * Get all available domain events
   */
  getAvailableEvents(): string[] {
    return Object.values(WORKFLOW_EVENTS);
  }
}

// Export singleton instance
export const domainEvents = new DomainEventsService();
