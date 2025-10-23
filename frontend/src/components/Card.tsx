/**
 * WF-COMP-XXX | Card.tsx - Card
 * Purpose: React component for Card functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  noPadding?: boolean;
}

const Card = ({ children, className, title, subtitle, actions, noPadding = false }: CardProps) => {
  return (
    <div className={clsx('card', className)}>
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className={clsx('card-body', { 'card-body-no-padding': noPadding })}>{children}</div>
    </div>
  );
};

export default Card;
