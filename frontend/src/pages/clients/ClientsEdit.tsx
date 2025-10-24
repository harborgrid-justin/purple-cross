/**
 * WF-COMP-015 | ClientsEdit.tsx - Edit client page
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: Form page for editing existing clients
 * Related: Client form component, clients store
 * Last Updated: 2025-10-22 | File Type: .tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { fetchClientById, updateClient } from './store';
import '../../styles/Page.css';

interface ClientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const ClientsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedClient: client, loading: fetchLoading } = useAppSelector(
    (state) => state.clients
  );
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await dispatch(updateClient({ id, data: formData })).unwrap();
      navigate(`/clients/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page">
        <div role="status" aria-live="polite">
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page">
        <div className="alert alert-warning" role="alert">
          <p>Client not found</p>
        </div>
        <Link to="/clients" className="btn-secondary">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>
          <span aria-hidden="true">👥</span> Edit Client: {client.firstName} {client.lastName}
        </h1>
        <Link to={`/clients/${client.id}`} className="btn-secondary">
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
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to={`/clients/${client.id}`} className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsEdit;
