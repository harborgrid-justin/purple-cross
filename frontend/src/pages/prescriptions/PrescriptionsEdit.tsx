/**
 * PrescriptionsEdit.tsx - Edit prescription page
 * Purpose: Form page for editing existing prescriptions
 * Related: usePrescription, useUpdatePrescription
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrescription, useUpdatePrescription } from '../../hooks/usePrescriptions';
import '../../styles/Page.css';

interface PrescriptionResponse {
  data?: {
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
    refills?: number;
    status?: string;
  };
}

interface PrescriptionFormData {
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refills: string;
  status: string;
}

const PrescriptionsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = usePrescription(id || '');
  const prescription = (response as PrescriptionResponse | undefined)?.data;
  const updateMutation = useUpdatePrescription();

  const [formData, setFormData] = useState<PrescriptionFormData>({
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refills: '',
    status: '',
  });

  useEffect(() => {
    if (prescription) {
      setFormData({
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        duration: prescription.duration || '',
        instructions: prescription.instructions || '',
        refills: prescription.refills != null ? String(prescription.refills) : '',
        status: prescription.status || '',
      });
    }
  }, [prescription]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      dosage: formData.dosage,
      frequency: formData.frequency,
      duration: formData.duration,
      instructions: formData.instructions || undefined,
      refills: formData.refills !== '' ? Number(formData.refills) : undefined,
      status: formData.status || undefined,
    };

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          navigate('/prescriptions');
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Prescription not found</p>
        </div>
        <Link to="/prescriptions" className="btn-secondary">
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Edit Prescription</h1>
        <p className="page-subtitle">Update prescription details</p>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update prescription'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="dosage">Dosage</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <input
            type="text"
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="refills">Refills</label>
          <input
            type="number"
            id="refills"
            name="refills"
            min={0}
            value={formData.refills}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select…</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/prescriptions" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionsEdit;
