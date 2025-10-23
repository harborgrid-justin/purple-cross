/**
 * WF-COMP-XXX | Workflow.tsx - Workflow Management
 * Purpose: Workflow automation and management interface
 * Dependencies: React
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import '../../styles/Page.css';

interface Workflow {
  id: string;
  documentId: string;
  workflowName: string;
  currentStep: number;
  totalSteps: number;
  status: string;
  createdAt: string;
}

const Workflow = () => {
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      documentId: 'doc-123',
      workflowName: 'Invoice Approval',
      currentStep: 2,
      totalSteps: 3,
      status: 'in_progress',
      createdAt: '2024-01-20',
    },
    {
      id: '2',
      documentId: 'doc-456',
      workflowName: 'Purchase Order Review',
      currentStep: 3,
      totalSteps: 3,
      status: 'completed',
      createdAt: '2024-01-18',
    },
    {
      id: '3',
      documentId: 'doc-789',
      workflowName: 'Contract Approval',
      currentStep: 1,
      totalSteps: 4,
      status: 'in_progress',
      createdAt: '2024-01-22',
    },
  ]);

  const [stats] = useState({
    total: 45,
    inProgress: 12,
    completed: 30,
    cancelled: 3,
  });

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-confirmed';
      case 'in_progress':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">⚙️</span> Workflow Engine
        </h1>
        <button className="btn-primary" aria-label="Create new workflow">
          + Create Workflow
        </button>
      </header>

      {/* Statistics Cards */}
      <div className="content-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Total Workflows
            </div>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>In Progress</div>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              {stats.cancelled}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cancelled</div>
          </div>
        </div>

        {/* Info Cards */}
        <div
          className="info-cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">🔄</span> Workflow Features
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Multi-step approvals</li>
              <li>Parallel processing</li>
              <li>Conditional routing</li>
              <li>Automated notifications</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">📊</span> Tracking
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Real-time status updates</li>
              <li>Audit trail logging</li>
              <li>Performance analytics</li>
              <li>Bottleneck detection</li>
            </ul>
          </div>
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span aria-hidden="true">🎯</span> Automation
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Event-driven triggers</li>
              <li>Scheduled execution</li>
              <li>Email notifications</li>
              <li>Deadline escalations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="content-section">
        <h2>Active Workflows</h2>
        <div className="table-container">
          <table className="data-table" role="table" aria-label="Workflows list">
            <thead>
              <tr>
                <th scope="col">Workflow Name</th>
                <th scope="col">Document ID</th>
                <th scope="col">Progress</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <th scope="row">{workflow.workflowName}</th>
                  <td style={{ fontSize: '0.875rem' }}>{workflow.documentId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${getProgressPercentage(workflow.currentStep, workflow.totalSteps)}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary-color)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {workflow.currentStep}/{workflow.totalSteps}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(workflow.status)}`}>
                      {workflow.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{workflow.createdAt}</td>
                  <td>
                    <button className="btn-action" aria-label={`View ${workflow.workflowName}`}>
                      View
                    </button>
                    {workflow.status === 'in_progress' && (
                      <button
                        className="btn-action"
                        aria-label={`Advance ${workflow.workflowName}`}
                      >
                        Advance
                      </button>
                    )}
                    <button className="btn-action" aria-label={`Cancel ${workflow.workflowName}`}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
