/**
 * WF-COMP-XXX | Alert.tsx - Alert
 * Purpose: React component for Alert functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { ReactNode } from 'react';
import clsx from 'clsx';
import './Alert.css';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert = ({ type = 'info', children, onClose, className }: AlertProps) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={clsx('alert', `alert-${type}`, className)} role="alert">
      <span className="alert-icon" aria-hidden="true">
        {icons[type]}
      </span>
      <div className="alert-content">{children}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert" type="button">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
