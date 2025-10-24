/**
 * WF-COMP-XXX | Modal.test.tsx - Modal Component Tests
 * Purpose: Comprehensive tests for Modal component
 * Dependencies: @testing-library/react, @testing-library/user-event
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import Modal from '../Modal';
import Button from '../Button';

describe('Modal Component', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    // Save original body overflow style
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    // Restore original body overflow style
    document.body.style.overflow = originalBodyOverflow;
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const { queryByRole } = renderWithoutRouter(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      const { getByText } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );

      expect(getByText('Modal content')).toBeInTheDocument();
    });

    it('should render modal overlay', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const overlay = container.querySelector('.modal-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('should render modal content', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toBeInTheDocument();
    });

    it('should render modal body', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const body = container.querySelector('.modal-body');
      expect(body).toBeInTheDocument();
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      const { getByText } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      expect(getByText('Modal Title')).toBeInTheDocument();
    });

    it('should render title as h2 heading', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      const heading = getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Modal Title');
    });

    it('should have correct title id', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      const title = container.querySelector('#modal-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Modal Title');
    });

    it('should have correct title class', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      const title = container.querySelector('.modal-title');
      expect(title).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      const { queryByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should connect title with dialog via aria-labelledby', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      const dialog = getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should not have aria-labelledby when no title', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const dialog = getByRole('dialog');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('should have correct aria-label on close button', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });

    it('should have correct type on close button', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAttribute('type', 'button');
    });

    it('should display × symbol in close button', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveTextContent('×');
    });

    it('should have modal-close class', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveClass('modal-close');
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard interaction (Enter)', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Footer', () => {
    it('should render footer when provided', () => {
      const footer = (
        <>
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      );
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} footer={footer}>
          <p>Content</p>
        </Modal>
      );

      const modalFooter = container.querySelector('.modal-footer');
      expect(modalFooter).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const modalFooter = container.querySelector('.modal-footer');
      expect(modalFooter).not.toBeInTheDocument();
    });

    it('should render footer buttons', () => {
      const footer = (
        <>
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
        </>
      );
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} footer={footer}>
          <p>Content</p>
        </Modal>
      );

      expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with small size', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} size="sm">
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toHaveClass('modal-sm');
    });

    it('should render with medium size (default)', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} size="md">
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toHaveClass('modal-md');
    });

    it('should render with large size', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} size="lg">
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toHaveClass('modal-lg');
    });

    it('should render with extra large size', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} size="xl">
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toHaveClass('modal-xl');
    });

    it('should default to medium size', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      expect(content).toHaveClass('modal-md');
    });
  });

  describe('Overlay Click Behavior', () => {
    it('should close on overlay click by default', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      const overlay = container.querySelector('.modal-overlay') as HTMLElement;
      await user.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should close on overlay click when closeOnOverlayClick is true', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose} closeOnOverlayClick>
          <p>Content</p>
        </Modal>
      );

      const overlay = container.querySelector('.modal-overlay') as HTMLElement;
      await user.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on overlay click when closeOnOverlayClick is false', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
          <p>Content</p>
        </Modal>
      );

      const overlay = container.querySelector('.modal-overlay') as HTMLElement;
      await user.click(overlay);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('should not close when clicking modal content', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content') as HTMLElement;
      await user.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('should not close when clicking modal body', async () => {
      const handleClose = vi.fn();
      const user = createUser();
      const { getByText } = renderWithoutRouter(
        <Modal isOpen onClose={handleClose}>
          <p>Click me</p>
        </Modal>
      );

      await user.click(getByText('Click me'));

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('should lock body scroll when modal opens', () => {
      renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when modal closes', () => {
      const { rerender } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('unset');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Modal Structure', () => {
    it('should render modal header', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Title">
          <p>Content</p>
        </Modal>
      );

      const header = container.querySelector('.modal-header');
      expect(header).toBeInTheDocument();
    });

    it('should contain title and close button in header', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Title">
          <p>Content</p>
        </Modal>
      );

      const header = container.querySelector('.modal-header');
      const title = container.querySelector('.modal-title');
      const closeButton = container.querySelector('.modal-close');

      expect(header).toContainElement(title);
      expect(header).toContainElement(closeButton);
    });

    it('should render all parts in correct order', () => {
      const footer = <Button>Close</Button>;
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Title" footer={footer}>
          <p>Content</p>
        </Modal>
      );

      const content = container.querySelector('.modal-content');
      const children = Array.from(content?.children || []);

      expect(children[0]).toHaveClass('modal-header');
      expect(children[1]).toHaveClass('modal-body');
      expect(children[2]).toHaveClass('modal-footer');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const dialog = getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should connect title with dialog via aria-labelledby', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      const dialog = getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have accessible close button', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      const closeButton = getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAccessibleName('Close modal');
    });

    it('should be keyboard navigable', async () => {
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <Button>Action</Button>
        </Modal>
      );

      await user.tab();

      const button = getByRole('button', { name: /action/i });
      expect(button).toHaveFocus();
    });
  });

  describe('Content Rendering', () => {
    it('should render simple text content', () => {
      const { getByText } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Simple text</p>
        </Modal>
      );

      expect(getByText('Simple text')).toBeInTheDocument();
    });

    it('should render complex nested content', () => {
      const { getByText, getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Complex Modal">
          <div>
            <h3>Section</h3>
            <p>Paragraph</p>
            <Button>Action</Button>
          </div>
        </Modal>
      );

      expect(getByText('Section')).toBeInTheDocument();
      expect(getByText('Paragraph')).toBeInTheDocument();
      expect(getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('should render forms', () => {
      const { getByLabelText, getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Form Modal">
          <form>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
            <Button type="submit">Submit</Button>
          </form>
        </Modal>
      );

      expect(getByLabelText('Name')).toBeInTheDocument();
      expect(getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} />
      );

      expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle =
        'This is a very long modal title that might need to wrap across multiple lines';
      const { getByText } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title={longTitle}>
          <p>Content</p>
        </Modal>
      );

      expect(getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      const { getByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()} title="Title">
          {null}
        </Modal>
      );

      expect(getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render anything when isOpen changes from true to false', () => {
      const { rerender, queryByRole } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(queryByRole('dialog')).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );

      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for simple modal', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen onClose={vi.fn()}>
          <p>Simple content</p>
        </Modal>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for modal with all features', () => {
      const footer = <Button>Close</Button>;
      const { container } = renderWithoutRouter(
        <Modal
          isOpen
          onClose={vi.fn()}
          title="Full Featured Modal"
          footer={footer}
          size="lg"
        >
          <p>Modal content</p>
        </Modal>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when closed', () => {
      const { container } = renderWithoutRouter(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
