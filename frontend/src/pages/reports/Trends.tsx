/**
 * WF-COMP-XXX | Trends.tsx - Trends
 * Purpose: React component for Trends functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useMemo, useState } from 'react';
import { useAppointmentAnalytics } from '../../hooks/useAnalytics';
import '../../styles/Page.css';

interface TrendPoint {
  period: string;
  count: number;
  revenue?: number;
}

interface AppointmentAnalytics {
  trend?: TrendPoint[];
  byDay?: TrendPoint[];
}

const RANGES: Array<{ value: string; label: string; days: number }> = [
  { value: '30', label: 'Last 30 days', days: 30 },
  { value: '90', label: 'Last 90 days', days: 90 },
  { value: '365', label: 'Last 12 months', days: 365 },
];

const toIsoDate = (date: Date): string => date.toISOString().split('T')[0];

const Trends = () => {
  const [range, setRange] = useState<string>('30');

  const { startDate, endDate } = useMemo(() => {
    const selected = RANGES.find((r) => r.value === range) ?? RANGES[0];
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - selected.days);
    return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
  }, [range]);

  const { data, isLoading, isError } = useAppointmentAnalytics({ startDate, endDate });

  const analytics = (data as { data?: AppointmentAnalytics } | undefined)?.data ?? {};
  const points: TrendPoint[] = analytics.trend ?? analytics.byDay ?? [];
  const peak = points.reduce((max, p) => Math.max(max, p.count), 0);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Trend Analysis</h1>
      </header>
      <p className="page-subtitle">Appointment volume trends over time.</p>

      <div className="search-bar" role="search">
        <div className="form-group">
          <label htmlFor="trend-range">Time Range</label>
          <select id="trend-range" value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div role="status" aria-live="polite">
          <p>Loading trend data…</p>
        </div>
      ) : isError ? (
        <div className="alert alert-error" role="alert">
          <p>Failed to load trend data. Please try again.</p>
        </div>
      ) : (
        <div className="table-container">
          {points.length === 0 ? (
            <div role="status" aria-live="polite">
              <p>No trend data available for the selected range.</p>
            </div>
          ) : (
            <table className="data-table" role="table" aria-label="Appointment trend">
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col">Appointments</th>
                  <th scope="col">Relative Volume</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => {
                  const width = peak > 0 ? Math.round((point.count / peak) * 100) : 0;
                  return (
                    <tr key={point.period}>
                      <th scope="row">{point.period}</th>
                      <td>{point.count.toLocaleString()}</td>
                      <td>
                        <div
                          role="img"
                          aria-label={`${width}% of peak volume`}
                          style={{
                            backgroundColor: 'var(--primary-color)',
                            height: '0.75rem',
                            width: `${width}%`,
                            minWidth: point.count > 0 ? '2px' : 0,
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Trends;
