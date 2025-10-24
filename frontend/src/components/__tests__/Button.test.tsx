/**
 * WF-COMP-XXX | Button.test.tsx - Button Component Tests
 * Purpose: Comprehensive tests for Button component
 * Dependencies: @testing-library/react, @testing-library/user-event
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import Button from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByRole } = renderWithoutRouter(<Button>Click me</Button>);

      const button = getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('btn-primary');
      expect(button).toHaveClass('btn-md');
    });

    it('should render children correctly', () => {
      const { getByText } = renderWithoutRouter(<Button>Save Changes</Button>);

      expect(getByText('Save Changes')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { getByRole } = renderWithoutRouter(
        <Button className="custom-class">Click me</Button>
      );

      const button = getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('btn'); // Should still have base class
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      const { getByRole } = renderWithoutRouter(
        <Button variant="primary">Primary</Button>
      );

      expect(getByRole('button')).toHaveClass('btn-primary');
    });

    it('should render secondary variant', () => {
      const { getByRole } = renderWithoutRouter(
        <Button variant="secondary">Secondary</Button>
      );

      expect(getByRole('button')).toHaveClass('btn-secondary');
    });

    it('should render danger variant', () => {
      const { getByRole } = renderWithoutRouter(
        <Button variant="danger">Delete</Button>
      );

      expect(getByRole('button')).toHaveClass('btn-danger');
    });

    it('should render success variant', () => {
      const { getByRole } = renderWithoutRouter(
        <Button variant="success">Success</Button>
      );

      expect(getByRole('button')).toHaveClass('btn-success');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByRole } = renderWithoutRouter(<Button size="sm">Small</Button>);

      expect(getByRole('button')).toHaveClass('btn-sm');
    });

    it('should render medium size (default)', () => {
      const { getByRole } = renderWithoutRouter(<Button size="md">Medium</Button>);

      expect(getByRole('button')).toHaveClass('btn-md');
    });

    it('should render large size', () => {
      const { getByRole } = renderWithoutRouter(<Button size="lg">Large</Button>);

      expect(getByRole('button')).toHaveClass('btn-lg');
    });
  });

  describe('Full Width', () => {
    it('should render full width button', () => {
      const { getByRole } = renderWithoutRouter(
        <Button fullWidth>Full Width</Button>
      );

      expect(getByRole('button')).toHaveClass('btn-full-width');
    });

    it('should not have full width class by default', () => {
      const { getByRole } = renderWithoutRouter(<Button>Normal</Button>);

      expect(getByRole('button')).not.toHaveClass('btn-full-width');
    });
  });

  describe('Loading State', () => {
    it('should render loading state', () => {
      const { getByRole, getByText } = renderWithoutRouter(
        <Button loading>Submit</Button>
      );

      const button = getByRole('button');
      expect(button).toHaveClass('btn-loading');
      expect(getByText('Loading...')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should show spinner in loading state', () => {
      const { container } = renderWithoutRouter(<Button loading>Submit</Button>);

      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not show children text when loading', () => {
      const { queryByText } = renderWithoutRouter(
        <Button loading>Submit Form</Button>
      );

      // Original button text should not be visible
      expect(queryByText('Submit Form')).not.toBeInTheDocument();
      // But Loading... text should be visible
      expect(queryByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      const { getByRole } = renderWithoutRouter(<Button disabled>Disabled</Button>);

      expect(getByRole('button')).toBeDisabled();
    });

    it('should be disabled when loading', () => {
      const { getByRole } = renderWithoutRouter(<Button loading>Loading</Button>);

      expect(getByRole('button')).toBeDisabled();
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      );

      await user.click(getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button loading onClick={handleClick}>
          Click me
        </Button>
      );

      await user.click(getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button onClick={handleClick}>Click me</Button>
      );

      await user.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button onClick={handleClick}>Click me</Button>
      );

      const button = getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should receive event object in onClick', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button onClick={handleClick}>Click me</Button>
      );

      await user.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
        })
      );
    });

    it('should support keyboard navigation (Enter key)', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button onClick={handleClick}>Click me</Button>
      );

      const button = getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard navigation (Space key)', async () => {
      const handleClick = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Button onClick={handleClick}>Click me</Button>
      );

      const button = getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTML Attributes', () => {
    it('should forward type attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Button type="submit">Submit</Button>
      );

      expect(getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should have button element', () => {
      const { getByRole } = renderWithoutRouter(<Button>Click</Button>);

      // Button should render as button element
      const button = getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should forward aria-label', () => {
      const { getByRole } = renderWithoutRouter(
        <Button aria-label="Close dialog">×</Button>
      );

      expect(getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('should forward data attributes', () => {
      const { getByRole } = renderWithoutRouter(
        <Button data-testid="custom-button" data-action="save">
          Save
        </Button>
      );

      const button = getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('data-action', 'save');
    });

    it('should forward id attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Button id="submit-button">Submit</Button>
      );

      expect(getByRole('button')).toHaveAttribute('id', 'submit-button');
    });

    it('should forward name attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Button name="action">Action</Button>
      );

      expect(getByRole('button')).toHaveAttribute('name', 'action');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const { getByRole } = renderWithoutRouter(<Button>Click me</Button>);

      const button = getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have proper role', () => {
      const { getByRole } = renderWithoutRouter(<Button>Click me</Button>);

      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-disabled when disabled', () => {
      const { getByRole } = renderWithoutRouter(<Button disabled>Disabled</Button>);

      expect(getByRole('button')).toHaveAttribute('disabled');
    });

    it('should have aria-hidden on spinner', () => {
      const { container } = renderWithoutRouter(<Button loading>Loading</Button>);

      const spinner = container.querySelector('.spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { container } = renderWithoutRouter(<Button />);

      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('should handle complex children (with icons)', () => {
      const { getByRole, getByText } = renderWithoutRouter(
        <Button>
          <span className="icon">🔍</span>
          <span>Search</span>
        </Button>
      );

      expect(getByRole('button')).toBeInTheDocument();
      expect(getByText('Search')).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long button text that might overflow';
      const { getByRole } = renderWithoutRouter(<Button>{longText}</Button>);

      expect(getByRole('button')).toHaveTextContent(longText);
    });

    it('should apply multiple classes correctly', () => {
      const { getByRole } = renderWithoutRouter(
        <Button variant="danger" size="lg" fullWidth loading className="custom">
          Delete
        </Button>
      );

      const button = getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('btn-danger');
      expect(button).toHaveClass('btn-lg');
      expect(button).toHaveClass('btn-full-width');
      expect(button).toHaveClass('btn-loading');
      expect(button).toHaveClass('custom');
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for default button', () => {
      const { container } = renderWithoutRouter(<Button>Click me</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for loading button', () => {
      const { container } = renderWithoutRouter(<Button loading>Loading</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for disabled button', () => {
      const { container } = renderWithoutRouter(<Button disabled>Disabled</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
