/**
 * WF-COMP-LABORATORY-006 | LaboratoryEdit.tsx - Edit laboratory page
 * Purpose: Form page for editing existing laboratory
 * Related: Laboratory form component, laboratory store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLabTest, useUpdateLabTest } from '../../hooks/useLabTests';
import '../../styles/Page.css';

interface LabTestResponse {
  data?: {
    status?: string;
    urgency?: string;
    externalLabName?: string;
    interpretation?: string;
    notes?: string;
  };
}

interface LabTestFormData {
  status: string;
  urgency: string;
  externalLabName: string;
  interpretation: string;
  notes: string;
}

const STATUS_OPTIONS = ['ordered', 'in-progress', 'completed', 'cancelled'];
const URGENCY_OPTIONS = ['routine', 'urgent', 'stat'];

const LaboratoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = useLabTest(id || '');
  const test = (response as LabTestResponse | undefined)?.data;
  const updateMutation = useUpdateLabTest();

  const [formData, setFormData] = useState<LabTestFormData>({
    status: '',
    urgency: '',
    externalLabName: '',
    interpretation: '',
    notes: '',
  });

  useEffect(() => {
    if (test) {
      setFormData({
        status: test.status || '',
        urgency: test.urgency || '',
        externalLabName: test.externalLabName || '',
        interpretation: test.interpretation || '',
        notes: test.notes || '',
      });
    }
  }, [test]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!id) return;

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate(`/laboratory/${id}`);
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading lab test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Lab test not found</p>
        </div>
        <Link to="/laboratory" className="btn-secondary">
          Back to Laboratory
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🔬</span> Edit Lab Test
        </h1>
        <Link to={`/laboratory/${id}`} className="btn-secondary">
          Cancel
        </Link>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update lab test'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="urgency">Urgency</label>
          <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange}>
            <option value="">Select urgency</option>
            {URGENCY_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="externalLabName">External Lab Name</label>
          <input
            type="text"
            id="externalLabName"
            name="externalLabName"
            value={formData.externalLabName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="interpretation">Interpretation</label>
          <textarea
            id="interpretation"
            name="interpretation"
            value={formData.interpretation}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/laboratory/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LaboratoryEdit;
