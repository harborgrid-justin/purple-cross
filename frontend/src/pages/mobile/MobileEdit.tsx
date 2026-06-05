/**
 * WF-COMP-MOBILE-006 | MobileEdit.tsx - Edit mobile page
 * Purpose: Form page for editing existing mobile
 * Related: Mobile form component, mobile store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/Page.css';

interface DeviceFormData {
  deviceName: string;
  owner: string;
  accessRevoked: boolean;
}

const MobileEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    deviceName: '',
    owner: '',
    accessRevoked: false,
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📱</span> Edit Device
        </h1>
        <Link to={`/mobile/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>
      <p className="page-subtitle">Device ID: {id}</p>

      {saved && (
        <div className="alert alert-success" role="status">
          <p>Device settings saved.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="deviceName">Device Name</label>
          <input
            type="text"
            id="deviceName"
            name="deviceName"
            value={formData.deviceName}
            onChange={(e) => setFormData((prev) => ({ ...prev, deviceName: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="owner">Owner</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="accessRevoked">
            <input
              type="checkbox"
              id="accessRevoked"
              checked={formData.accessRevoked}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, accessRevoked: e.target.checked }))
              }
            />{' '}
            Revoke access
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          <Link to={`/mobile/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MobileEdit;
