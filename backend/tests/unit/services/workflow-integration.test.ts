import { domainEvents } from '../../../src/services/domain-events.service';
import { workflowTriggerService } from '../../../src/services/workflow-trigger.service';
import { webhookEvents } from '../../../src/services/webhook-events.service';
import { WORKFLOW_EVENTS } from '../../../src/constants';

// Mock the dependencies
jest.mock('../../../src/services/workflow-trigger.service');
jest.mock('../../../src/services/webhook-events.service');

describe('Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Domain Events Service', () => {
    it('should emit events to both webhook and workflow systems', () => {
      const mockData = {
        patientId: 'patient-123',
        patient: { id: 'patient-123', name: 'Fluffy' },
      };

      // Emit event
      domainEvents.emit(WORKFLOW_EVENTS.PATIENT_CREATED, mockData);

      // Verify both systems received the event
      expect(webhookEvents.emitWebhookEvent).toHaveBeenCalledWith(
        WORKFLOW_EVENTS.PATIENT_CREATED,
        mockData
      );
      expect(workflowTriggerService.emitWorkflowEvent).toHaveBeenCalledWith(
        WORKFLOW_EVENTS.PATIENT_CREATED,
        mockData
      );
    });

    it('should return all available events', () => {
      const events = domainEvents.getAvailableEvents();
      
      expect(events).toContain('patient.created');
      expect(events).toContain('appointment.completed');
      expect(events).toContain('invoice.paid');
      expect(events.length).toBeGreaterThan(10);
    });
  });

  describe('Workflow Events', () => {
    it('should support all domain event types', () => {
      const expectedEvents = [
        'patient.created',
        'patient.updated',
        'patient.deleted',
        'client.created',
        'client.updated',
        'client.deleted',
        'appointment.created',
        'appointment.updated',
        'appointment.cancelled',
        'appointment.completed',
        'invoice.created',
        'invoice.paid',
        'invoice.overdue',
        'medical_record.created',
        'medical_record.updated',
        'lab_test.ordered',
        'lab_test.completed',
        'prescription.created',
        'prescription.refilled',
      ];

      const availableEvents = domainEvents.getAvailableEvents();

      expectedEvents.forEach((event) => {
        expect(availableEvents).toContain(event);
      });
    });
  });

  describe('Event Data Structure', () => {
    it('should emit patient events with proper structure', () => {
      const patientData = {
        patientId: 'patient-123',
        patient: {
          id: 'patient-123',
          name: 'Fluffy',
          species: 'cat',
          ownerId: 'owner-456',
        },
      };

      domainEvents.emit(WORKFLOW_EVENTS.PATIENT_CREATED, patientData);

      expect(workflowTriggerService.emitWorkflowEvent).toHaveBeenCalledWith(
        'patient.created',
        expect.objectContaining({
          patientId: expect.any(String),
          patient: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        })
      );
    });

    it('should emit appointment events with proper structure', () => {
      const appointmentData = {
        appointmentId: 'appt-123',
        appointment: {
          id: 'appt-123',
          patientId: 'patient-123',
          clientId: 'client-456',
          status: 'completed',
        },
      };

      domainEvents.emit(WORKFLOW_EVENTS.APPOINTMENT_COMPLETED, appointmentData);

      expect(workflowTriggerService.emitWorkflowEvent).toHaveBeenCalledWith(
        'appointment.completed',
        expect.objectContaining({
          appointmentId: expect.any(String),
          appointment: expect.any(Object),
        })
      );
    });

    it('should emit update events with previous data', () => {
      const updateData = {
        patientId: 'patient-123',
        patient: { id: 'patient-123', name: 'Fluffy Updated' },
        previousData: { id: 'patient-123', name: 'Fluffy' },
      };

      domainEvents.emit(WORKFLOW_EVENTS.PATIENT_UPDATED, updateData);

      expect(workflowTriggerService.emitWorkflowEvent).toHaveBeenCalledWith(
        'patient.updated',
        expect.objectContaining({
          patientId: expect.any(String),
          patient: expect.any(Object),
          previousData: expect.any(Object),
        })
      );
    });
  });
});
