/**
 * WF-COMP-XXX | Spinner.tsx - Spinner
 * Purpose: React component for Spinner functionality
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const Spinner = ({ size = 'md', className, label = 'Loading...' }: SpinnerProps) => {
  return (
    <div className={clsx('spinner-container', className)} role="status" aria-live="polite">
      <div className={clsx('spinner', `spinner-${size}`)} aria-hidden="true"></div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
