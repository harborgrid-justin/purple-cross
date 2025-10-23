/**
 * ActionNode.tsx - Custom node component for React Flow workflow builder
 * Purpose: Visual representation of workflow actions with edit/delete capabilities
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ActionNodeData {
  label: string;
  actionType: string;
  config: Record<string, unknown>;
  isParallel: boolean;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

const getActionIcon = (actionType: string): string => {
  const icons: Record<string, string> = {
    send_email: '📧',
    send_notification: '🔔',
    update_record: '✏️',
    create_record: '➕',
    webhook: '🌐',
    wait: '⏰',
    condition: '🔀',
  };
  return icons[actionType] || '⚙️';
};

const getActionColor = (actionType: string): string => {
  const colors: Record<string, string> = {
    send_email: '#3b82f6',
    send_notification: '#8b5cf6',
    update_record: '#10b981',
    create_record: '#22c55e',
    webhook: '#f59e0b',
    wait: '#6366f1',
    condition: '#ec4899',
  };
  return colors[actionType] || '#6b7280';
};

const ActionNode = memo(({ data, id, selected }: NodeProps<ActionNodeData>) => {
  const actionColor = getActionColor(data.actionType);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `2px solid ${selected ? actionColor : '#e5e7eb'}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '180px',
        boxShadow: selected ? `0 4px 12px ${actionColor}40` : '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: actionColor,
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>{getActionIcon(data.actionType)}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#1f2937',
              wordBreak: 'break-word',
            }}
          >
            {data.label}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'capitalize',
            }}
          >
            {data.actionType.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {data.isParallel && (
        <div
          style={{
            fontSize: '0.7rem',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '2px 6px',
            borderRadius: '4px',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          ⚡ Parallel
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => data.onEdit(id)}
          style={{
            flex: 1,
            fontSize: '0.75rem',
            padding: '4px 8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = actionColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          Edit
        </button>
        <button
          onClick={() => data.onDelete(id)}
          style={{
            flex: 1,
            fontSize: '0.75rem',
            padding: '4px 8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#ef4444',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          Delete
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: actionColor,
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
