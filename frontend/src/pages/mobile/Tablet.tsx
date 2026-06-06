/**
 * WF-COMP-XXX | Tablet.tsx - Tablet
 * Purpose: React component for Tablet functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import '../../styles/Page.css';

type Orientation = 'portrait' | 'landscape';

interface PatientRow {
  id: string;
  name: string;
  species?: string;
}

const DIMENSIONS: Record<Orientation, { width: number; height: number }> = {
  portrait: { width: 768, height: 1024 },
  landscape: { width: 1024, height: 768 },
};

const Tablet = () => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const { data, isLoading } = usePatients({ limit: 5 });

  const patients = (data as { data?: PatientRow[] } | undefined)?.data ?? [];
  const { width, height } = DIMENSIONS[orientation];
  const scale = 0.35;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Tablet Optimization</h1>
      </header>
      <p className="page-subtitle">Preview how patient lists render on tablet viewports.</p>

      <div className="search-bar" role="search">
        <div className="form-group">
          <label htmlFor="orientation">Orientation</label>
          <select
            id="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
          >
            <option value="portrait">
              Portrait ({DIMENSIONS.portrait.width}×{DIMENSIONS.portrait.height})
            </option>
            <option value="landscape">
              Landscape ({DIMENSIONS.landscape.width}×{DIMENSIONS.landscape.height})
            </option>
          </select>
        </div>
      </div>

      <div
        role="img"
        aria-label={`Tablet preview in ${orientation} orientation`}
        style={{
          width: width * scale,
          height: height * scale,
          border: '2px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-md)',
          overflow: 'auto',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        {isLoading ? (
          <p role="status" aria-live="polite">
            Loading preview…
          </p>
        ) : patients.length === 0 ? (
          <p>No patient data to preview.</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>
                {patient.name} — {patient.species ?? 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Tablet;
