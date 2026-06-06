/**
 * WF-COMP-XXX | LabEquipment.tsx - Lab Equipment
 * Purpose: React component for LabEquipment functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useEquipment } from '../../hooks/useEquipment';
import '../../styles/Page.css';

interface EquipmentRow {
  id: string;
  name?: string;
  category?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  location?: string;
  status?: string;
}

const LabEquipment = () => {
  const { data, isLoading, isError } = useEquipment({ limit: 50 });

  const equipment = (data as { data?: EquipmentRow[] } | undefined)?.data ?? [];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Equipment Management</h1>
        <p className="page-subtitle">Laboratory instruments and assets</p>
      </header>

      <div className="table-container">
        {isLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading equipment...</p>
          </div>
        ) : isError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load equipment. Please try again.</p>
          </div>
        ) : equipment.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No equipment found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Laboratory equipment">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Manufacturer</th>
                <th scope="col">Model</th>
                <th scope="col">Serial</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.name ?? 'N/A'}</th>
                  <td>{item.category ?? 'N/A'}</td>
                  <td>{item.manufacturer ?? 'N/A'}</td>
                  <td>{item.modelNumber ?? 'N/A'}</td>
                  <td>{item.serialNumber ?? 'N/A'}</td>
                  <td>{item.location ?? 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${item.status ?? 'active'}`}>
                      {item.status ?? 'active'}
                    </span>
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

export default LabEquipment;
