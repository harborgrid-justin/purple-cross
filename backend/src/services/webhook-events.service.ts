import { EventEmitter } from 'events';
import { logger } from '../config/logger';
import { webhookService } from './webhook.service';
import { queueWebhook } from '../jobs';

/**
 * Webhook Event Types
 * Define all events that can trigger webhooks
 */
export const WEBHOOK_EVENTS = {
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

  // Test event
  WEBHOOK_TEST: 'webhook.test',
} as const;

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

/**
 * Webhook Events Service
 * Manages event emission and webhook triggering
 */
class WebhookEventsService extends EventEmitter {
  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * Set up event handlers for all webhook events
   */
  private setupEventHandlers(): void {
    // Listen to all events and trigger webhooks
    Object.values(WEBHOOK_EVENTS).forEach((event) => {
      this.on(event, async (data: Record<string, unknown>) => {
        await this.triggerWebhooks(event, data);
      });
    });
  }

  /**
   * Trigger webhooks for a specific event
   */
  private async triggerWebhooks(event: string, data: Record<string, unknown>): Promise<void> {
    try {
      // Find all webhooks subscribed to this event
      const webhooks = await webhookService.getWebhooksByEvent(event);

      if (webhooks.length === 0) {
        logger.debug('No webhooks subscribed to event', { event });
        return;
      }

      // Queue webhook delivery for each subscription
      const promises = webhooks.map((webhook: { id: string }) =>
        queueWebhook(webhook.id, event, data)
      );

      await Promise.all(promises);

      logger.info('Webhooks triggered for event', {
        event,
        count: webhooks.length,
      });
    } catch (error) {
      logger.error('Error triggering webhooks', {
        event,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Emit a webhook event
   */
  emitWebhookEvent(event: WebhookEventType, data: Record<string, unknown>): void {
    this.emit(event, data);
  }

  /**
   * Get all available webhook events
   */
  getAvailableEvents(): string[] {
    return Object.values(WEBHOOK_EVENTS);
  }
}

// Export singleton instance
export const webhookEvents = new WebhookEventsService();
