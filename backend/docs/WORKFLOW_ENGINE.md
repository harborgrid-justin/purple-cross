# Workflow Engine Documentation

## Overview

The Purple Cross Workflow Engine provides automated business process management for document routing, approvals, and multi-step procedures. Workflows can be triggered by events, scheduled, or initiated manually.

## Features

- **Multi-Step Workflows**: Define complex processes with multiple sequential steps
- **Progress Tracking**: Real-time visibility into workflow execution
- **Status Management**: Track workflows through their lifecycle
- **Document Association**: Link workflows to specific documents
- **Statistics & Analytics**: Monitor workflow performance and bottlenecks
- **API-Driven**: Full REST API for programmatic control

## Core Concepts

### Workflow

A workflow represents an automated process with multiple steps. Each workflow:
- Is associated with a document
- Has a defined number of total steps
- Tracks current progress (current step)
- Maintains status (in_progress, completed, cancelled, failed)
- Contains step definitions in JSON format

### Workflow Steps

Steps represent individual actions or approvals in the workflow. Each step can:
- Require user action (approval, review)
- Execute automated actions (email, notification)
- Have conditions for execution
- Move to next step automatically or manually

### Workflow Status

- `in_progress`: Workflow is currently executing
- `completed`: All steps completed successfully
- `cancelled`: Workflow was cancelled by user
- `failed`: Workflow encountered an error

## API Endpoints

### Create Workflow

```http
POST /api/v1/workflows
Content-Type: application/json

{
  "documentId": "doc-123",
  "workflowName": "Invoice Approval",
  "totalSteps": 3,
  "currentStep": 1,
  "steps": {
    "1": {
      "name": "Manager Review",
      "assignee": "manager@example.com",
      "type": "approval"
    },
    "2": {
      "name": "Finance Approval",
      "assignee": "finance@example.com",
      "type": "approval"
    },
    "3": {
      "name": "Final Processing",
      "type": "automated"
    }
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "workflow-123",
    "documentId": "doc-123",
    "workflowName": "Invoice Approval",
    "currentStep": 1,
    "totalSteps": 3,
    "status": "in_progress",
    "steps": { ... },
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

### List Workflows

```http
GET /api/v1/workflows?page=1&limit=10&status=in_progress
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `documentId` (optional): Filter by document ID

### Get Workflow by ID

```http
GET /api/v1/workflows/:id
```

### Get Workflow Statistics

```http
GET /api/v1/workflows/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 45,
    "inProgress": 12,
    "completed": 30,
    "cancelled": 3
  }
}
```

### Get Workflows by Document

```http
GET /api/v1/workflows/document/:documentId
```

### Update Workflow

```http
PUT /api/v1/workflows/:id
Content-Type: application/json

{
  "currentStep": 2,
  "steps": {
    "1": {
      "name": "Manager Review",
      "status": "completed",
      "completedAt": "2024-01-20T11:00:00Z"
    }
  }
}
```

### Advance Workflow

Move workflow to the next step:

```http
POST /api/v1/workflows/:id/advance
```

This automatically:
- Increments `currentStep`
- Updates status to `completed` if last step
- Sets `completedAt` timestamp if completed

### Cancel Workflow

```http
POST /api/v1/workflows/:id/cancel
```

## Workflow Patterns

### Simple Approval Workflow

```javascript
const workflow = {
  documentId: "invoice-001",
  workflowName: "Simple Invoice Approval",
  totalSteps: 2,
  steps: {
    "1": {
      name: "Manager Review",
      assignee: "manager@example.com",
      type: "approval",
      dueDate: "2024-01-25T17:00:00Z"
    },
    "2": {
      name: "Send to Accounting",
      type: "automated",
      action: "send_email",
      recipient: "accounting@example.com"
    }
  }
};
```

### Multi-Level Approval

```javascript
const workflow = {
  documentId: "contract-001",
  workflowName: "Contract Review",
  totalSteps: 4,
  steps: {
    "1": {
      name: "Department Review",
      assignee: "dept-head@example.com",
      type: "approval"
    },
    "2": {
      name: "Legal Review",
      assignee: "legal@example.com",
      type: "approval"
    },
    "3": {
      name: "Executive Approval",
      assignee: "ceo@example.com",
      type: "approval"
    },
    "4": {
      name: "Finalize & Archive",
      type: "automated",
      actions: ["archive_document", "send_notifications"]
    }
  }
};
```

### Conditional Workflow

```javascript
const workflow = {
  documentId: "purchase-order-001",
  workflowName: "Purchase Order Approval",
  totalSteps: 3,
  steps: {
    "1": {
      name: "Amount Check",
      type: "condition",
      condition: "amount > 10000",
      onTrue: "2",
      onFalse: "3"
    },
    "2": {
      name: "Executive Approval",
      assignee: "cfo@example.com",
      type: "approval",
      requiredFor: "amount > 10000"
    },
    "3": {
      name: "Process Order",
      type: "automated",
      action: "create_purchase_order"
    }
  }
};
```

## Integration Examples

### Creating a Workflow (JavaScript)

```javascript
const axios = require('axios');

async function createInvoiceWorkflow(invoiceId) {
  const workflow = {
    documentId: invoiceId,
    workflowName: "Invoice Approval Process",
    totalSteps: 3,
    currentStep: 1,
    steps: {
      "1": {
        name: "Department Manager Approval",
        assignee: "manager@example.com",
        type: "approval",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      "2": {
        name: "Finance Department Approval",
        assignee: "finance@example.com",
        type: "approval",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      "3": {
        name: "Payment Processing",
        type: "automated",
        action: "process_payment"
      }
    }
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/workflows',
      workflow,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log('Workflow created:', response.data.data.id);
    return response.data.data;
  } catch (error) {
    console.error('Error creating workflow:', error.message);
    throw error;
  }
}
```

### Advancing a Workflow

```javascript
async function approveStep(workflowId) {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/workflows/${workflowId}/advance`
    );
    
    const workflow = response.data.data;
    console.log(`Workflow advanced to step ${workflow.currentStep}/${workflow.totalSteps}`);
    
    if (workflow.status === 'completed') {
      console.log('Workflow completed!');
    }
    
    return workflow;
  } catch (error) {
    console.error('Error advancing workflow:', error.message);
    throw error;
  }
}
```

### Monitoring Workflow Progress

```javascript
async function monitorWorkflow(workflowId) {
  const response = await axios.get(
    `http://localhost:3000/api/v1/workflows/${workflowId}`
  );
  
  const workflow = response.data.data;
  const progress = (workflow.currentStep / workflow.totalSteps) * 100;
  
  console.log(`Workflow: ${workflow.workflowName}`);
  console.log(`Progress: ${progress.toFixed(0)}% (${workflow.currentStep}/${workflow.totalSteps})`);
  console.log(`Status: ${workflow.status}`);
  
  return workflow;
}
```

## React Integration Example

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Workflow {
  id: string;
  workflowName: string;
  currentStep: number;
  totalSteps: number;
  status: string;
}

function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  async function fetchWorkflows() {
    try {
      const response = await axios.get('/api/v1/workflows');
      setWorkflows(response.data.data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  }

  async function advanceWorkflow(id: string) {
    try {
      await axios.post(`/api/v1/workflows/${id}/advance`);
      fetchWorkflows(); // Refresh list
    } catch (error) {
      console.error('Error advancing workflow:', error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Active Workflows</h2>
      {workflows.map(workflow => (
        <div key={workflow.id} className="workflow-card">
          <h3>{workflow.workflowName}</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(workflow.currentStep / workflow.totalSteps) * 100}%` }}
            />
          </div>
          <p>Step {workflow.currentStep} of {workflow.totalSteps}</p>
          <p>Status: {workflow.status}</p>
          {workflow.status === 'in_progress' && (
            <button onClick={() => advanceWorkflow(workflow.id)}>
              Advance to Next Step
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Clear Step Names

Use descriptive names for workflow steps:

```javascript
// Good
"Manager Approval - Budget Review"

// Less clear
"Step 2"
```

### 2. Track Assignees

Always include assignee information for approval steps:

```javascript
{
  name: "Legal Review",
  assignee: "legal@example.com",
  assignedAt: "2024-01-20T10:00:00Z",
  dueDate: "2024-01-25T17:00:00Z"
}
```

### 3. Handle Timeouts

Set reasonable due dates and handle overdue workflows:

```javascript
const now = new Date();
const dueDate = new Date(workflow.steps[currentStep].dueDate);

if (now > dueDate) {
  // Send escalation notification
  await sendEscalationEmail(workflow);
}
```

### 4. Audit Trail

Maintain a complete audit trail in step data:

```javascript
{
  name: "Manager Approval",
  assignee: "manager@example.com",
  status: "completed",
  startedAt: "2024-01-20T10:00:00Z",
  completedAt: "2024-01-20T14:30:00Z",
  completedBy: "manager@example.com",
  comments: "Approved with minor revisions"
}
```

### 5. Error Handling

Handle workflow failures gracefully:

```javascript
try {
  await advanceWorkflow(workflowId);
} catch (error) {
  // Update workflow status
  await axios.put(`/api/v1/workflows/${workflowId}`, {
    status: 'failed',
    error: error.message
  });
  
  // Notify stakeholders
  await notifyWorkflowFailure(workflowId);
}
```

## Monitoring & Analytics

### Workflow Statistics

```javascript
async function getWorkflowMetrics() {
  const response = await axios.get('/api/v1/workflows/stats');
  const stats = response.data.data;
  
  console.log(`Total Workflows: ${stats.total}`);
  console.log(`In Progress: ${stats.inProgress}`);
  console.log(`Completed: ${stats.completed}`);
  console.log(`Completion Rate: ${(stats.completed / stats.total * 100).toFixed(1)}%`);
}
```

### Average Completion Time

Track workflow efficiency:

```javascript
async function calculateAverageCompletionTime() {
  const response = await axios.get('/api/v1/workflows?status=completed');
  const workflows = response.data.data;
  
  const completionTimes = workflows.map(w => {
    const start = new Date(w.createdAt);
    const end = new Date(w.completedAt);
    return (end - start) / (1000 * 60 * 60); // Hours
  });
  
  const average = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
  console.log(`Average completion time: ${average.toFixed(1)} hours`);
}
```

## Troubleshooting

### Workflow Not Advancing

1. **Check current step**: Ensure `currentStep < totalSteps`
2. **Verify status**: Workflow must be `in_progress`
3. **Review API response**: Check for error messages
4. **Check permissions**: Ensure user has permission to advance

### Missing Workflows

1. **Check filters**: Review query parameters
2. **Verify document ID**: Ensure correct document association
3. **Check status**: Workflow may be cancelled or completed

### Performance Issues

1. **Pagination**: Use pagination for large workflow lists
2. **Filtering**: Filter by status or document ID to reduce results
3. **Indexing**: Ensure database indexes on frequently queried fields

## Future Enhancements

Planned features for the workflow engine:

- **Visual Workflow Builder**: Drag-and-drop workflow design interface
- **Action Library**: Pre-built actions for common tasks
- **Conditional Logic**: Branch workflows based on conditions
- **Parallel Steps**: Execute multiple steps simultaneously
- **Workflow Templates**: Reusable workflow definitions
- **Event Triggers**: Automatically start workflows on events
- **Schedule Triggers**: Start workflows at specific times
- **Notifications**: Automatic email/SMS notifications for steps
- **Integrations**: Connect with external systems via webhooks

## Support

For questions or issues with workflows:
1. Review workflow status and step data
2. Check application logs for errors
3. Verify API request/response data
4. Contact support with workflow ID
