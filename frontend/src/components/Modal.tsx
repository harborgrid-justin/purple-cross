/**
 * WF-COMP-XXX | Modal.tsx - Modal
 * Purpose: React component for Modal functionality with WCAG 2.1 AA accessibility
 * Dependencies: react
 * Last Updated: 2025-10-24 | File Type: .tsx
 *
 * Accessibility Features:
 * - Focus trap: Tab cycles within modal only
 * - Escape key: Closes modal
 * - Focus management: Returns focus to trigger element on close
 * - ARIA attributes: role="dialog", aria-modal, aria-labelledby, aria-describedby
 */

import { ReactNode, useEffect, useRef } from 'react';
import clsx from 'clsx';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
  closeOnOverlayClick = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus the first focusable element in the modal
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';

      // Return focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Focus trap handler
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: Move focus to previous element
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move focus to next element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Helper function to get all focusable elements within the modal
  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const elements = modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
    return Array.from(elements);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div className={clsx('modal-content', `modal-${size}`)} ref={modalRef}>
        <div className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          <button className="modal-close" onClick={onClose} aria-label="Close modal" type="button">
            ×
          </button>
        </div>
        {description && (
          <p id="modal-description" className="sr-only">
            {description}
          </p>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
