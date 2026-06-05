/**
 * WF-COMP-XXX | RemoteDesktop.tsx - Remote Desktop
 * Purpose: React component for RemoteDesktop functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import { FormField } from '../../components/form/FormField';
import '../../styles/Page.css';

const sessionSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  user: z.string().min(1, 'User is required'),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface RemoteSession {
  id: string;
  host: string;
  user: string;
  startedAt: string;
  active: boolean;
}

const RemoteDesktop = () => {
  const [sessions, setSessions] = useState<RemoteSession[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(sessionSchema);

  const onSubmit = (data: SessionFormData): void => {
    setSessions((prev) => [
      {
        id: crypto.randomUUID(),
        host: data.host,
        user: data.user,
        startedAt: new Date().toISOString(),
        active: true,
      },
      ...prev,
    ]);
    reset();
  };

  const handleEnd = (id: string): void => {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, active: false } : session))
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Remote Desktop</h1>
      </header>
      <p className="page-subtitle">Start and monitor secure remote desktop sessions.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
        <FormField
          label="Host"
          registration={register('host')}
          error={errors.host}
          placeholder="workstation-01"
          required
        />
        <FormField label="User" registration={register('user')} error={errors.user} required />
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Start Session
          </button>
        </div>
      </form>

      <h2>Sessions</h2>
      <div className="table-container">
        {sessions.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No remote sessions started yet.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Remote desktop sessions">
            <thead>
              <tr>
                <th scope="col">Host</th>
                <th scope="col">User</th>
                <th scope="col">Started</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <th scope="row">{session.host}</th>
                  <td>{session.user}</td>
                  <td>
                    <time dateTime={session.startedAt}>
                      {new Date(session.startedAt).toLocaleString()}
                    </time>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${session.active ? 'confirmed' : 'cancelled'}`}
                      role="status"
                    >
                      {session.active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                  <td>
                    {session.active ? (
                      <button
                        className="btn-action"
                        onClick={() => handleEnd(session.id)}
                        aria-label={`End session on ${session.host}`}
                      >
                        End
                      </button>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RemoteDesktop;
