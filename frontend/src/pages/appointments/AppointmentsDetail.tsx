/**
 * WF-COMP-033 | AppointmentsDetail.tsx - Appointment detail page
 * Purpose: Display detailed information for a single appointment
 * Related: Appointment details component, appointments store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAppointmentById } from './store';
import '../../styles/Page.css';

const AppointmentsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedAppointment: appointment, loading, error } = useAppSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error" role="alert">
          <p>Error: {error}</p>
        </div>
        <Link to="/appointments" className="btn-secondary">
          Back to Appointments
        </Link>
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
          <span aria-hidden="true">📅</span> Appointment Details
        </h1>
        <div>
          <Link to={`/appointments/${appointment.id}/edit`} className="btn-primary">
            Edit Appointment
          </Link>
          <Link to="/appointments" className="btn-secondary" style={{ marginLeft: '0.5rem' }}>
            Back to List
          </Link>
        </div>
      </header>

      <div className="content-section">
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Appointment Information</h2>
            <dl>
              <dt>Type:</dt>
              <dd>{appointment.type}</dd>
              <dt>Status:</dt>
              <dd>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status}
                </span>
              </dd>
              <dt>Start Time:</dt>
              <dd>{new Date(appointment.startTime).toLocaleString()}</dd>
              <dt>End Time:</dt>
              <dd>{new Date(appointment.endTime).toLocaleString()}</dd>
              {appointment.reason && (
                <>
                  <dt>Reason:</dt>
                  <dd>{appointment.reason}</dd>
                </>
              )}
              {appointment.notes && (
                <>
                  <dt>Notes:</dt>
                  <dd>{appointment.notes}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="detail-section">
            <h2>Patient & Client</h2>
            <dl>
              <dt>Patient ID:</dt>
              <dd>{appointment.patientId}</dd>
              <dt>Client ID:</dt>
              <dd>{appointment.clientId}</dd>
              {appointment.staffId && (
                <>
                  <dt>Staff ID:</dt>
                  <dd>{appointment.staffId}</dd>
                </>
              )}
            </dl>
          </div>

          <div className="detail-section">
            <h2>Record Information</h2>
            <dl>
              <dt>Created:</dt>
              <dd>{new Date(appointment.createdAt).toLocaleDateString()}</dd>
              <dt>Last Updated:</dt>
              <dd>{new Date(appointment.updatedAt).toLocaleDateString()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDetail;
