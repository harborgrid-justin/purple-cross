/**
 * WF-COMP-034 | AppointmentsCreate.tsx - Create appointment page
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: Form page for creating new appointments
 * Related: Appointment form component, appointments store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { createAppointment } from './store';
import '../../styles/Page.css';

interface AppointmentFormData {
  patientId: string;
  clientId: string;
  staffId?: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  reason?: string;
  notes?: string;
}

const AppointmentsCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    clientId: '',
    staffId: '',
    startTime: '',
    endTime: '',
    type: '',
    status: 'scheduled',
    reason: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(createAppointment(formData)).unwrap();
      navigate(`/appointments/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📅</span> Schedule New Appointment
        </h1>
        <Link to="/appointments" className="btn-secondary">
          Cancel
        </Link>
      </header>

      <div className="content-section">
        {error && (
          <div className="alert alert-error" role="alert">
            <p>Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="patientId">
              Patient ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientId">
              Client ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">
              Appointment Type <span className="required">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select type</option>
              <option value="checkup">Check-up</option>
              <option value="vaccination">Vaccination</option>
              <option value="surgery">Surgery</option>
              <option value="emergency">Emergency</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startTime">
              Start Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">
              End Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="staffId">Staff ID</label>
            <input
              type="text"
              id="staffId"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
            <Link to="/appointments" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsCreate;
