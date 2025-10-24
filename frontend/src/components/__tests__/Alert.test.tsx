/**
 * WF-COMP-XXX | Alert.test.tsx - Alert Component Tests
 * Purpose: Comprehensive tests for Alert component
 * Dependencies: @testing-library/react, @testing-library/user-event
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import Alert from '../Alert';

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByRole } = renderWithoutRouter(<Alert>Alert message</Alert>);

      const alert = getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Alert message');
    });

    it('should render children correctly', () => {
      const { getByText } = renderWithoutRouter(
        <Alert>This is an important message</Alert>
      );

      expect(getByText('This is an important message')).toBeInTheDocument();
    });

    it('should have correct default classes', () => {
      const { getByRole } = renderWithoutRouter(<Alert>Message</Alert>);

      const alert = getByRole('alert');
      expect(alert).toHaveClass('alert');
      expect(alert).toHaveClass('alert-info'); // Default type
    });

    it('should render with custom className', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert className="custom-alert">Message</Alert>
      );

      const alert = getByRole('alert');
      expect(alert).toHaveClass('custom-alert');
      expect(alert).toHaveClass('alert'); // Should still have base class
    });
  });

  describe('Alert Types', () => {
    it('should render success alert', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert type="success">Success message</Alert>
      );

      expect(getByRole('alert')).toHaveClass('alert-success');
    });

    it('should render error alert', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert type="error">Error message</Alert>
      );

      expect(getByRole('alert')).toHaveClass('alert-error');
    });

    it('should render warning alert', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert type="warning">Warning message</Alert>
      );

      expect(getByRole('alert')).toHaveClass('alert-warning');
    });

    it('should render info alert (default)', () => {
      const { getByRole } = renderWithoutRouter(<Alert>Info message</Alert>);

      expect(getByRole('alert')).toHaveClass('alert-info');
    });

    it('should render info alert explicitly', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert type="info">Info message</Alert>
      );

      expect(getByRole('alert')).toHaveClass('alert-info');
    });
  });

  describe('Icons', () => {
    it('should render success icon', () => {
      const { container } = renderWithoutRouter(
        <Alert type="success">Success</Alert>
      );

      const icon = container.querySelector('.alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('✓');
    });

    it('should render error icon', () => {
      const { container } = renderWithoutRouter(<Alert type="error">Error</Alert>);

      const icon = container.querySelector('.alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('✕');
    });

    it('should render warning icon', () => {
      const { container } = renderWithoutRouter(
        <Alert type="warning">Warning</Alert>
      );

      const icon = container.querySelector('.alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('⚠');
    });

    it('should render info icon', () => {
      const { container } = renderWithoutRouter(<Alert type="info">Info</Alert>);

      const icon = container.querySelector('.alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('ℹ');
    });

    it('should have aria-hidden on icon', () => {
      const { container } = renderWithoutRouter(<Alert>Message</Alert>);

      const icon = container.querySelector('.alert-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Alert Content', () => {
    it('should render alert content div', () => {
      const { container } = renderWithoutRouter(<Alert>Content</Alert>);

      const content = container.querySelector('.alert-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content');
    });

    it('should render simple text content', () => {
      const { getByText } = renderWithoutRouter(
        <Alert>Simple text message</Alert>
      );

      expect(getByText('Simple text message')).toBeInTheDocument();
    });

    it('should render complex JSX content', () => {
      const { getByText } = renderWithoutRouter(
        <Alert>
          <strong>Important:</strong> This is a complex message with{' '}
          <a href="/link">a link</a>
        </Alert>
      );

      expect(getByText('Important:')).toBeInTheDocument();
      expect(getByText('a link')).toBeInTheDocument();
    });

    it('should render multiline content', () => {
      const { getByText } = renderWithoutRouter(
        <Alert>
          <div>Line 1</div>
          <div>Line 2</div>
          <div>Line 3</div>
        </Alert>
      );

      expect(getByText('Line 1')).toBeInTheDocument();
      expect(getByText('Line 2')).toBeInTheDocument();
      expect(getByText('Line 3')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button when onClose is provided', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      expect(getByRole('button', { name: /close alert/i })).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      const { queryByRole } = renderWithoutRouter(<Alert>Message</Alert>);

      expect(queryByRole('button', { name: /close alert/i })).not.toBeInTheDocument();
    });

    it('should have correct aria-label on close button', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close alert');
    });

    it('should have correct type on close button', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      expect(closeButton).toHaveAttribute('type', 'button');
    });

    it('should have correct class on close button', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      expect(closeButton).toHaveClass('alert-close');
    });

    it('should display × symbol in close button', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      expect(closeButton).toHaveTextContent('×');
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose multiple times on multiple clicks', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(3);
    });

    it('should support keyboard interaction on close button (Enter)', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard interaction on close button (Space)', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      closeButton.focus();
      await user.keyboard(' ');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout and Structure', () => {
    it('should have proper DOM structure', () => {
      const { container } = renderWithoutRouter(<Alert>Message</Alert>);

      const alert = container.querySelector('.alert');
      const icon = container.querySelector('.alert-icon');
      const content = container.querySelector('.alert-content');

      expect(alert).toContainElement(icon);
      expect(alert).toContainElement(content as HTMLElement);
    });

    it('should have proper DOM structure with close button', () => {
      const handleClose = vi.fn();
      const { container } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const alert = container.querySelector('.alert');
      const icon = container.querySelector('.alert-icon');
      const content = container.querySelector('.alert-content');
      const closeButton = container.querySelector('.alert-close');

      expect(alert).toContainElement(icon);
      expect(alert).toContainElement(content as HTMLElement);
      expect(alert).toContainElement(closeButton);
    });

    it('should order elements correctly: icon, content, close button', () => {
      const handleClose = vi.fn();
      const { container } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const alert = container.querySelector('.alert');
      const children = Array.from(alert?.children || []);

      expect(children[0]).toHaveClass('alert-icon');
      expect(children[1]).toHaveClass('alert-content');
      expect(children[2]).toHaveClass('alert-close');
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      const { getByRole } = renderWithoutRouter(<Alert>Message</Alert>);

      expect(getByRole('alert')).toBeInTheDocument();
    });

    it('should be automatically announced by screen readers', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert>Important notification</Alert>
      );

      const alert = getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should have accessible close button', () => {
      const handleClose = vi.fn();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });
      expect(closeButton).toHaveAccessibleName('Close alert');
    });

    it('should hide icon from screen readers', () => {
      const { container } = renderWithoutRouter(<Alert>Message</Alert>);

      const icon = container.querySelector('.alert-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be keyboard navigable when closeable', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Alert onClose={handleClose}>Message</Alert>
      );

      const closeButton = getByRole('button', { name: /close alert/i });

      // Tab to focus the button
      await user.tab();
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Different Alert Scenarios', () => {
    it('should render success alert with close button', () => {
      const handleClose = vi.fn();
      const { getByRole, container } = renderWithoutRouter(
        <Alert type="success" onClose={handleClose}>
          Operation completed successfully
        </Alert>
      );

      expect(getByRole('alert')).toHaveClass('alert-success');
      expect(container.querySelector('.alert-icon')).toHaveTextContent('✓');
      expect(getByRole('button', { name: /close alert/i })).toBeInTheDocument();
    });

    it('should render error alert with custom class', () => {
      const { getByRole } = renderWithoutRouter(
        <Alert type="error" className="critical-error">
          Critical error occurred
        </Alert>
      );

      const alert = getByRole('alert');
      expect(alert).toHaveClass('alert-error');
      expect(alert).toHaveClass('critical-error');
    });

    it('should render warning alert with complex content', () => {
      const { getByText } = renderWithoutRouter(
        <Alert type="warning">
          <div>
            <strong>Warning:</strong> This action cannot be undone.
          </div>
          <div>Are you sure you want to continue?</div>
        </Alert>
      );

      expect(getByText('Warning:')).toBeInTheDocument();
      expect(getByText('This action cannot be undone.')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { getByRole } = renderWithoutRouter(<Alert />);

      expect(getByRole('alert')).toBeInTheDocument();
    });

    it('should handle very long messages', () => {
      const longMessage =
        'This is a very long alert message that might span multiple lines and needs to be handled gracefully by the component without breaking the layout or causing any visual issues';
      const { getByText } = renderWithoutRouter(<Alert>{longMessage}</Alert>);

      expect(getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle messages with special characters', () => {
      const specialMessage = 'Alert with special chars: <>&"\'';
      const { getByText } = renderWithoutRouter(<Alert>{specialMessage}</Alert>);

      expect(getByText(specialMessage)).toBeInTheDocument();
    });

    it('should handle null onClose gracefully', () => {
      const { queryByRole } = renderWithoutRouter(
        <Alert onClose={undefined}>Message</Alert>
      );

      expect(queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for default alert', () => {
      const { container } = renderWithoutRouter(<Alert>Default alert</Alert>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for success alert with close button', () => {
      const handleClose = vi.fn();
      const { container } = renderWithoutRouter(
        <Alert type="success" onClose={handleClose}>
          Success alert
        </Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for error alert', () => {
      const { container } = renderWithoutRouter(
        <Alert type="error">Error alert</Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for warning alert', () => {
      const { container } = renderWithoutRouter(
        <Alert type="warning">Warning alert</Alert>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
