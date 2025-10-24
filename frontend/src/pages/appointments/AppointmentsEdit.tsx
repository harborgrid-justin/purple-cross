/**
 * WF-COMP-035 | AppointmentsEdit.tsx - Edit appointment page
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: Form page for editing existing appointments
 * Related: Appointment form component, appointments store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { fetchAppointmentById, updateAppointment } from './store';
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

const AppointmentsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAppointment: appointment, loading: fetchLoading } = useAppSelector(
    (state) => state.appointments
  );
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

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        clientId: appointment.clientId || '',
        staffId: appointment.staffId || '',
        startTime: new Date(appointment.startTime).toISOString().slice(0, 16),
        endTime: new Date(appointment.endTime).toISOString().slice(0, 16),
        type: appointment.type || '',
        status: appointment.status || 'scheduled',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
      });
    }
  }, [appointment]);

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
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch(updateAppointment({ id, data: formData })).unwrap();
      navigate(`/appointments/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Appointment not found</p>
        </div>
        <Link to="/appointments" className="btn-secondary">
          Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">📅</span> Edit Appointment
        </h1>
        <Link to={`/appointments/${appointment.id}`} className="btn-secondary">
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to={`/appointments/${appointment.id}`} className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsEdit;
