/**
 * MedicalRecordsEdit.tsx - Edit medical record page
 * Purpose: Form page for editing existing medical records
 * Related: useMedicalRecord, useUpdateMedicalRecord
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMedicalRecord, useUpdateMedicalRecord } from '../../hooks/useMedicalRecords';
import '../../styles/Page.css';

interface MedicalRecordResponse {
  data?: {
    visitDate?: string;
    chiefComplaint?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
  };
}

interface MedicalRecordFormData {
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

const MedicalRecordsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading: fetchLoading } = useMedicalRecord(id || '');
  const record = (response as MedicalRecordResponse | undefined)?.data;
  const updateMutation = useUpdateMedicalRecord();

  const [formData, setFormData] = useState<MedicalRecordFormData>({
    visitDate: '',
    chiefComplaint: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        visitDate: record.visitDate ? new Date(record.visitDate).toISOString().split('T')[0] : '',
        chiefComplaint: record.chiefComplaint || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
        notes: record.notes || '',
      });
    }
  }, [record]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
          navigate('/medical-records');
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Medical record not found</p>
        </div>
        <Link to="/medical-records" className="btn-secondary">
          Back to Medical Records
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Edit Medical Record</h1>
        <p className="page-subtitle">Update the visit details</p>
      </header>

      {updateMutation.isError && (
        <div className="alert alert-error" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update medical record'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="visitDate">Visit Date</label>
          <input
            type="date"
            id="visitDate"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chiefComplaint">Chief Complaint</label>
          <input
            type="text"
            id="chiefComplaint"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis</label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatment">Treatment</label>
          <input
            type="text"
            id="treatment"
            name="treatment"
            value={formData.treatment}
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
          <Link to="/medical-records" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordsEdit;
