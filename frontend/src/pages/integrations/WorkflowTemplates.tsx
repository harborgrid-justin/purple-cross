/**
 * WF-COMP-XXX | WorkflowTemplates.tsx - Workflow Templates Management
 * Purpose: Workflow template management and execution interface
 * Dependencies: React, API
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, useEffect } from 'react';
import { workflowTemplatesApi } from '../../services/modules/workflowsApi';
import type { WorkflowTemplate, WorkflowAction } from '../../services/modules/workflowsApi';
import '../../styles/Page.css';

const WorkflowTemplates = () => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    triggerType: 'manual' | 'event' | 'schedule';
    triggerConfig: Record<string, unknown>;
    actions: WorkflowAction[];
    isPublic: boolean;
  }>({
    name: '',
    description: '',
    category: 'general',
    triggerType: 'manual',
    triggerConfig: {},
    actions: [],
    isPublic: false,
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workflowTemplatesApi.getTemplates();
      setTemplates(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflow templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await workflowTemplatesApi.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleExecuteTemplate = async (id: string) => {
    if (!window.confirm('Execute this workflow template?')) return;
    try {
      await workflowTemplatesApi.executeTemplate(id);
      alert('Workflow queued for execution!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow template?')) return;
    try {
      await workflowTemplatesApi.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow template');
    }
  };

  const handleAddAction = () => {
    const newAction: WorkflowAction = {
      id: `action-${Date.now()}`,
      type: 'send_email',
      name: 'New Action',
      config: {},
    };
    setFormData({
      ...formData,
      actions: [...formData.actions, newAction],
    });
  };

  const handleUpdateAction = (index: number, field: keyof WorkflowAction, value: unknown) => {
    const updatedActions = [...formData.actions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setFormData({ ...formData, actions: updatedActions });
  };

  const handleRemoveAction = (index: number) => {
    const updatedActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: updatedActions });
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.actions.length === 0) {
      alert('Please add at least one action');
      return;
    }
    try {
      await workflowTemplatesApi.createTemplate(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        category: 'general',
        triggerType: 'manual',
        triggerConfig: {},
        actions: [],
        isPublic: false,
      });
      fetchTemplates();
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow template');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>
            <span aria-hidden="true">⚙️</span> Workflow Templates
          </h1>
        </header>
        <div className="content-section" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading workflow templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">⚙️</span> Workflow Templates
        </h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
          aria-label="Create new workflow template"
        >
          + Create Template
        </button>
      </header>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <strong>Error:</strong> {error}
          <button
            style={{ marginLeft: '1rem' }}
            className="btn-secondary"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info Cards */}
      <div className="content-section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
              <span aria-hidden="true">📋</span> Available Actions
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
              <li>Send Email</li>
              <li>Send Notification</li>
              <li>Update Record</li>
              <li>Create Record</li>
              <li>Call Webhook</li>
              <li>Wait/Delay</li>
              <li>Conditional Logic</li>
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
              <span aria-hidden="true">🎯</span> Trigger Types
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
              <li>Manual Execution</li>
              <li>Event-Based</li>
              <li>Schedule-Based (Cron)</li>
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
              <span aria-hidden="true">📊</span> Categories
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {categories.length > 0 ? categories.join(', ') : 'No categories yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="content-section" style={{ marginBottom: '2rem' }}>
          <h2>Create Workflow Template</h2>
          <form onSubmit={handleCreateTemplate}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label htmlFor="triggerType" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Trigger Type
                </label>
                <select
                  id="triggerType"
                  value={formData.triggerType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      triggerType: e.target.value as 'manual' | 'event' | 'schedule',
                    })
                  }
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="manual">Manual</option>
                  <option value="event">Event</option>
                  <option value="schedule">Schedule</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Make template public
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <strong>Actions ({formData.actions.length})</strong>
                <button type="button" className="btn-secondary" onClick={handleAddAction}>
                  + Add Action
                </button>
              </div>

              {formData.actions.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                  No actions added yet. Click "Add Action" to get started.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.actions.map((action, index) => (
                    <div
                      key={action.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 2fr 1fr auto',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Action name"
                          value={action.name}
                          onChange={(e) => handleUpdateAction(index, 'name', e.target.value)}
                          style={{ padding: '0.5rem' }}
                        />
                        <select
                          value={action.type}
                          onChange={(e) => handleUpdateAction(index, 'type', e.target.value)}
                          style={{ padding: '0.5rem' }}
                        >
                          <option value="send_email">Send Email</option>
                          <option value="send_notification">Send Notification</option>
                          <option value="update_record">Update Record</option>
                          <option value="create_record">Create Record</option>
                          <option value="webhook">Call Webhook</option>
                          <option value="wait">Wait/Delay</option>
                          <option value="condition">Condition</option>
                        </select>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Step {index + 1}
                        </span>
                        <button
                          type="button"
                          className="btn-action"
                          onClick={() => handleRemoveAction(index)}
                          style={{ color: '#ef4444' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={formData.actions.length === 0}
              >
                Create Template
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    name: '',
                    description: '',
                    category: 'general',
                    triggerType: 'manual',
                    triggerConfig: {},
                    actions: [],
                    isPublic: false,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      <div className="content-section">
        <h2>Workflow Templates ({templates.length})</h2>
        {templates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No workflow templates yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Trigger Type</th>
                  <th>Actions</th>
                  <th>Usage Count</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td>
                      <strong>{template.name}</strong>
                      {template.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {template.description}
                        </div>
                      )}
                    </td>
                    <td>{template.category}</td>
                    <td>{template.triggerType}</td>
                    <td>{template.actions.length} steps</td>
                    <td>{template.usageCount}</td>
                    <td>
                      <span
                        className={`status-badge ${template.isActive ? 'status-confirmed' : 'status-cancelled'}`}
                      >
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => handleExecuteTemplate(template.id)}
                      >
                        Execute
                      </button>
                      <button
                        className="btn-action"
                        onClick={() => handleDeleteTemplate(template.id)}
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTemplates;
