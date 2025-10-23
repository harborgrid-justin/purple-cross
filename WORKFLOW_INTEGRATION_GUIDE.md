# Workflow Integration Guide

## Overview

This guide explains how the workflow automation system (from PR #70) has been integrated with domain services to enable event-driven automation.

## Architecture

### Components

1. **Workflow Builder** (Frontend)
   - Visual drag-and-drop interface using React Flow
   - 7 action types: email, notification, record updates, webhooks, wait, conditions
   - Support for parallel action execution

2. **Workflow Engine** (Backend)
   - Template-based workflow execution
   - Parallel action execution support
   - Variable passing between actions
   - Comprehensive error handling

3. **Domain Events Service** (New)
   - Unified event emission service
   - Coordinates both webhook and workflow triggers
   - Centralized event management

4. **Workflow Trigger Service** (New)
   - Listens to domain events
   - Finds matching workflow templates
   - Automatically executes workflows when events occur

### Event Flow

```
Domain Service (e.g., PatientService)
    ↓
domainEvents.emit('patient.created', data)
    ↓
    ├─→ webhookEvents → Webhook Delivery
    └─→ workflowTriggerService → Workflow Execution
```

## Supported Events

The following domain events automatically trigger both webhooks and workflows:

### Patient Events
- `patient.created` - When a new patient is created
- `patient.updated` - When a patient record is updated
- `patient.deleted` - When a patient is marked as inactive

### Client Events
- `client.created` - When a new client is created
- `client.updated` - When a client record is updated
- `client.deleted` - When a client is marked as inactive

### Appointment Events
- `appointment.created` - When a new appointment is scheduled
- `appointment.updated` - When an appointment is modified
- `appointment.cancelled` - When an appointment is cancelled
- `appointment.completed` - When an appointment is completed

### Invoice Events
- `invoice.created` - When a new invoice is created
- `invoice.paid` - When an invoice is marked as paid
- `invoice.overdue` - When an invoice becomes overdue

### Medical Record Events
- `medical_record.created` - When a new medical record is created
- `medical_record.updated` - When a medical record is updated

### Lab Test Events
- `lab_test.ordered` - When a lab test is ordered
- `lab_test.completed` - When lab test results are available

### Prescription Events
- `prescription.created` - When a new prescription is created
- `prescription.refilled` - When a prescription is refilled

## Creating Event-Driven Workflows

### Step 1: Create a Workflow Template

1. Navigate to **Integrations → Workflow Builder**
2. Add actions using the drag-and-drop interface
3. Configure action properties
4. Click "Save Template"

### Step 2: Configure Event Trigger

When saving the template, set:
- **Trigger Type:** `event`
- **Trigger Config:** 
  ```json
  {
    "event": "patient.created"
  }
  ```

### Step 3: Activate the Template

Ensure the template is:
- Marked as **Active**
- Has valid actions configured
- Has proper trigger configuration

### Step 4: Test the Workflow

Create a new patient (or trigger the relevant event). The workflow will:
1. Be automatically detected by the workflow trigger service
2. Execute all configured actions
3. Log execution status and results

## Example Workflows

### 1. New Patient Welcome Workflow

**Trigger:** `patient.created`

**Actions:**
1. Wait 1 hour (to ensure registration is complete)
2. Send welcome email to client
3. Create reminder for first checkup

### 2. Appointment Reminder Workflow

**Trigger:** `appointment.created`

**Actions:**
1. Wait 24 hours before appointment
2. Send email reminder to client
3. Send SMS notification (if configured)

### 3. Invoice Overdue Follow-up

**Trigger:** `invoice.overdue`

**Actions:**
1. Send overdue notice email
2. Create follow-up task for staff
3. Update client status (parallel)

### 4. Lab Test Results Notification

**Trigger:** `lab_test.completed`

**Actions:**
1. Check if results are abnormal (condition)
2. Send urgent notification to veterinarian
3. Schedule follow-up appointment

## Advanced Features

### Parallel Execution

Actions can be marked to execute in parallel by toggling the "Execute in parallel" checkbox in the workflow builder. Consecutive parallel actions are grouped and executed concurrently.

### Variable Passing

Data from the triggering event is available to all actions:
- `patientId` - ID of the patient
- `patient` - Full patient object
- `clientId` - ID of the client (if applicable)
- Additional context data

### Conditional Logic

Use the "Condition" action type to create branching workflows:
- Compare field values
- Check for empty/non-empty fields
- Use AND/OR logic
- Skip actions based on conditions

## Monitoring and Debugging

### View Workflow Executions

Navigate to **Integrations → Workflow Templates** and click on a template to see:
- Execution history
- Success/failure rates
- Execution details and logs

### Check Workflow Logs

The backend logs all workflow activity:
```bash
cd backend
npm run dev
# Logs will show workflow triggers and execution
```

### Common Issues

1. **Workflow not triggering**
   - Verify template is active
   - Check trigger configuration matches event name exactly
   - Ensure event is being emitted by domain service

2. **Action failing**
   - Check action configuration
   - Review execution logs
   - Verify required fields are present

3. **Parallel execution issues**
   - Review action dependencies
   - Check for shared resources
   - Verify error handling

## API Integration

### Manually Trigger Workflow

```typescript
POST /api/v1/workflow-templates/:id/execute
{
  "triggerData": {
    "patientId": "patient-123",
    "customData": "value"
  }
}
```

### List Active Workflows

```typescript
GET /api/v1/workflow-templates?isActive=true&triggerType=event
```

### View Execution Details

```typescript
GET /api/v1/workflow-executions/:id
```

## Best Practices

1. **Test workflows in development** before activating in production
2. **Use descriptive action names** for easier debugging
3. **Keep workflows focused** - one workflow per business process
4. **Monitor execution rates** to detect issues early
5. **Use parallel execution** for independent actions to improve performance
6. **Add wait actions** to space out notifications and prevent spam
7. **Use conditions** to handle different scenarios in a single workflow

## Technical Details

### Service Architecture

- `domain-events.service.ts` - Unified event emission
- `workflow-trigger.service.ts` - Event-based workflow execution
- `workflow-engine.service.ts` - Workflow execution logic
- `workflow-template.service.ts` - Template management
- `workflow-execution.service.ts` - Execution tracking

### Database Models

- `WorkflowTemplate` - Workflow definitions
- `WorkflowExecution` - Execution instances
- `WorkflowExecutionStep` - Individual action results

### Type Safety

All workflow integration code is fully typed with TypeScript:
- Zero `any` types in new code
- Explicit type annotations
- Strict null checks
- Comprehensive interfaces

## Future Enhancements

Potential improvements for future iterations:

1. **Workflow Analytics Dashboard** - Visual insights into workflow performance
2. **A/B Testing** - Test different workflow variations
3. **Workflow Templates Marketplace** - Share and import community workflows
4. **Real-time Execution Monitoring** - Live view of running workflows
5. **Advanced Scheduling** - Cron-based recurring workflows
6. **Sub-workflows** - Call workflows from within workflows
7. **External Integrations** - Connect to more third-party services

## Support

For questions or issues:
1. Check the logs for detailed error messages
2. Review workflow execution history
3. Verify event trigger configuration
4. Contact the development team

## Related Documentation

- [Visual Workflow Builder Implementation](./WORKFLOW_BUILDER_IMPLEMENTATION.md)
- [Webhooks and Workflows Implementation](./WEBHOOKS_WORKFLOWS_IMPLEMENTATION.md)
- [Backend Constants Reference](./backend/src/constants/index.ts)
