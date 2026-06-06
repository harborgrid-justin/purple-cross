/**
 * WF-COMP-XXX | Scheduling.tsx - Scheduling
 * Purpose: React component for Scheduling functionality
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useStaff } from '../../hooks/useStaff';
import '../../styles/Page.css';

interface TimeBlockRow {
  id: string;
  staffId?: string;
  blockType?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  recurring?: boolean;
}

interface StaffName {
  id: string;
  firstName?: string;
  lastName?: string;
}

const Scheduling = () => {
  const {
    data: blocksData,
    isLoading: blocksLoading,
    isError: blocksError,
  } = useTimeBlocks({ limit: 50 });
  const { data: staffData } = useStaff({ limit: 50 });

  const blocks = (blocksData as { data?: TimeBlockRow[] } | undefined)?.data ?? [];
  const staff = (staffData as { data?: StaffName[] } | undefined)?.data ?? [];

  const staffNameById = new Map<string, string>();
  for (const member of staff) {
    staffNameById.set(member.id, `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim());
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Shift Scheduling</h1>
        <p className="page-subtitle">Staff time blocks and shift assignments</p>
      </header>

      <div className="table-container">
        {blocksLoading ? (
          <div role="status" aria-live="polite">
            <p>Loading schedule...</p>
          </div>
        ) : blocksError ? (
          <div className="alert alert-error" role="alert">
            <p>Failed to load schedule. Please try again.</p>
          </div>
        ) : blocks.length === 0 ? (
          <div role="status" aria-live="polite">
            <p>No scheduled time blocks found.</p>
          </div>
        ) : (
          <table className="data-table" role="table" aria-label="Shift schedule">
            <thead>
              <tr>
                <th scope="col">Staff</th>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Recurring</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <th scope="row">
                    {(block.staffId && staffNameById.get(block.staffId)) || 'Unassigned'}
                  </th>
                  <td>{block.title ?? 'N/A'}</td>
                  <td>{block.blockType ?? 'N/A'}</td>
                  <td>
                    {block.startTime ? (
                      <time dateTime={block.startTime}>
                        {new Date(block.startTime).toLocaleString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {block.endTime ? (
                      <time dateTime={block.endTime}>
                        {new Date(block.endTime).toLocaleString()}
                      </time>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{block.recurring ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Scheduling;
