/**
 * WF-COMP-XXX | Segmentation.tsx - Segmentation
 * NOTE: Migrated from Redux to TanStack Query hooks - 2025-10-24
 * Purpose: React component for Segmentation functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import '../../styles/Page.css';

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  patients?: Array<{ id: string }>;
}

type Segment = 'all' | 'no-pets' | 'single-pet' | 'multi-pet';

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'all', label: 'All Clients' },
  { value: 'no-pets', label: 'No Pets' },
  { value: 'single-pet', label: 'Single Pet' },
  { value: 'multi-pet', label: 'Multi-Pet Households' },
];

const segmentOf = (count: number): Exclude<Segment, 'all'> => {
  if (count === 0) return 'no-pets';
  if (count === 1) return 'single-pet';
  return 'multi-pet';
};

const Segmentation = () => {
  const [segment, setSegment] = useState<Segment>('all');
  const { data, isLoading, isError } = useClients({ limit: 100 });

  const clients = useMemo<ClientRow[]>(
    () => (data as { data?: ClientRow[] } | undefined)?.data ?? [],
    [data]
  );

  const segmented = useMemo(
    () =>
      clients.map((c) => ({
        ...c,
        petCount: c.patients?.length ?? 0,
      })),
    [clients]
  );

  const filtered =
    segment === 'all' ? segmented : segmented.filter((c) => segmentOf(c.petCount) === segment);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Client Segmentation</h1>
        <p className="page-subtitle">Group clients by pet ownership for targeted outreach</p>
      </header>

      <div className="search-bar" role="search">
        <label htmlFor="segment-select" className="sr-only">
          Select segment
        </label>
        <select
          id="segment-select"
          value={segment}
          onChange={(e) => setSegment(e.target.value as Segment)}
          aria-label="Select client segment"
        >
          {SEGMENTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading client segments...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load clients. Please try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No clients in this segment.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Client segments">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Pets</th>
                <th scope="col">Segment</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <th scope="row">
                    {client.firstName} {client.lastName}
                  </th>
                  <td>{client.email}</td>
                  <td>{client.petCount}</td>
                  <td>
                    {SEGMENTS.find((s) => s.value === segmentOf(client.petCount))?.label ??
                      'Unknown'}
                  </td>
                  <td>
                    <Link
                      to={`/clients/${client.id}`}
                      className="btn-action"
                      aria-label={`View ${client.firstName} ${client.lastName}`}
                    >
                      View
                    </Link>
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

export default Segmentation;
