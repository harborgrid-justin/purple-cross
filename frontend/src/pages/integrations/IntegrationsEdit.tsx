/**
 * WF-COMP-INTEGRATIONS-006 | IntegrationsEdit.tsx - Edit integrations page
 * Purpose: Form page for editing existing integrations
 * Related: Integrations form component, integrations store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

interface IntegrationFormData {
  name: string;
  endpoint: string;
  enabled: boolean;
}

const IntegrationsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<IntegrationFormData>({
    name: '',
    endpoint: '',
    enabled: true,
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔗</span> Edit Integration
        </h1>
        <Link to={`/integrations/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>
      <p className="page-subtitle">Integration ID: {id}</p>

      {saved && (
        <div className="alert alert-success" role="status">
          <p>Integration settings saved.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endpoint">Endpoint URL</label>
          <input
            type="url"
            id="endpoint"
            name="endpoint"
            value={formData.endpoint}
            onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="enabled">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
            />{' '}
            Enabled
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          <Link to={`/integrations/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default IntegrationsEdit;
