/**
 * WF-COMP-XXX | Input.test.tsx - Input Component Tests
 * Purpose: Comprehensive tests for Input component
 * Dependencies: @testing-library/react, @testing-library/user-event
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithoutRouter, createUser } from '@/test-utils';
import Input from '../Input';
import { createRef } from 'react';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      const { getByRole } = renderWithoutRouter(<Input />);

      expect(getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with default classes', () => {
      const { getByRole } = renderWithoutRouter(<Input />);

      const input = getByRole('textbox');
      expect(input).toHaveClass('form-input');
    });

    it('should render form group wrapper', () => {
      const { container } = renderWithoutRouter(<Input />);

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { getByRole } = renderWithoutRouter(<Input className="custom-input" />);

      const input = getByRole('textbox');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass('form-input'); // Should still have base class
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      const { getByLabelText } = renderWithoutRouter(<Input label="Name" />);

      expect(getByLabelText('Name')).toBeInTheDocument();
    });

    it('should associate label with input using htmlFor', () => {
      const { getByLabelText } = renderWithoutRouter(
        <Input label="Email" id="email-input" />
      );

      const input = getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should generate unique id if not provided', () => {
      const { getByLabelText } = renderWithoutRouter(<Input label="Username" />);

      const input = getByLabelText('Username');
      const inputId = input.getAttribute('id');

      expect(inputId).toBeTruthy();
      expect(inputId).toMatch(/^input-/);
    });

    it('should have correct label class', () => {
      const { container } = renderWithoutRouter(<Input label="Password" />);

      const label = container.querySelector('.form-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Password');
    });

    it('should not render label when not provided', () => {
      const { container } = renderWithoutRouter(<Input />);

      const label = container.querySelector('.form-label');
      expect(label).not.toBeInTheDocument();
    });

    it('should show required indicator when required', () => {
      const { container } = renderWithoutRouter(<Input label="Name" required />);

      const requiredSpan = container.querySelector('.form-required');
      expect(requiredSpan).toBeInTheDocument();
      expect(requiredSpan).toHaveTextContent('*');
    });

    it('should not show required indicator when not required', () => {
      const { container } = renderWithoutRouter(<Input label="Name" />);

      const requiredSpan = container.querySelector('.form-required');
      expect(requiredSpan).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error message', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Email" error="Invalid email address" />
      );

      expect(getByRole('alert')).toHaveTextContent('Invalid email address');
    });

    it('should have error class on input', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Email" error="Invalid email" />
      );

      expect(getByRole('textbox')).toHaveClass('form-input-error');
    });

    it('should have error class with correct selector', () => {
      const { container } = renderWithoutRouter(
        <Input label="Email" error="Error" />
      );

      const errorMessage = container.querySelector('.form-error');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error');
    });

    it('should set aria-invalid when error exists', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Email" error="Invalid" />
      );

      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should set aria-invalid to false when no error', () => {
      const { getByRole } = renderWithoutRouter(<Input label="Email" />);

      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should connect error message with aria-describedby', () => {
      const { getByRole, container } = renderWithoutRouter(
        <Input label="Email" id="email" error="Invalid email" />
      );

      const input = getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      const errorElement = container.querySelector(`#${errorId}`);

      expect(errorElement).toHaveTextContent('Invalid email');
    });

    it('should not render error when no error prop', () => {
      const { queryByRole } = renderWithoutRouter(<Input label="Email" />);

      const errors = queryByRole('alert');
      expect(errors).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should render helper text', () => {
      const { getByText } = renderWithoutRouter(
        <Input label="Password" helperText="Must be at least 8 characters" />
      );

      expect(getByText('Must be at least 8 characters')).toBeInTheDocument();
    });

    it('should have helper text class', () => {
      const { container } = renderWithoutRouter(
        <Input label="Password" helperText="Helper text" />
      );

      const helper = container.querySelector('.form-helper');
      expect(helper).toBeInTheDocument();
      expect(helper).toHaveTextContent('Helper text');
    });

    it('should connect helper text with aria-describedby', () => {
      const { getByRole, container } = renderWithoutRouter(
        <Input label="Password" id="password" helperText="Helper text" />
      );

      const input = getByRole('textbox');
      const helperId = input.getAttribute('aria-describedby');
      const helperElement = container.querySelector(`#${helperId}`);

      expect(helperElement).toHaveTextContent('Helper text');
    });

    it('should not show helper text when error exists', () => {
      const { queryByText } = renderWithoutRouter(
        <Input
          label="Email"
          helperText="Enter your email"
          error="Invalid email"
        />
      );

      expect(queryByText('Enter your email')).not.toBeInTheDocument();
      expect(queryByText('Invalid email')).toBeInTheDocument();
    });

    it('should not render helper text when not provided', () => {
      const { container } = renderWithoutRouter(<Input label="Email" />);

      const helper = container.querySelector('.form-helper');
      expect(helper).not.toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    it('should apply full width class when fullWidth is true', () => {
      const { container } = renderWithoutRouter(<Input fullWidth />);

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).toHaveClass('form-group-full-width');
    });

    it('should not apply full width class by default', () => {
      const { container } = renderWithoutRouter(<Input />);

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).not.toHaveClass('form-group-full-width');
    });

    it('should not apply full width class when fullWidth is false', () => {
      const { container } = renderWithoutRouter(<Input fullWidth={false} />);

      const formGroup = container.querySelector('.form-group');
      expect(formGroup).not.toHaveClass('form-group-full-width');
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      const { getByRole } = renderWithoutRouter(<Input label="Name" />);

      const input = getByRole('textbox');
      expect(input.tagName).toBe('INPUT');
    });

    it('should render password input', () => {
      const { container } = renderWithoutRouter(
        <Input label="Password" type="password" />
      );

      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render email input', () => {
      const { container } = renderWithoutRouter(
        <Input label="Email" type="email" />
      );

      const input = container.querySelector('input[type="email"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      const { container } = renderWithoutRouter(
        <Input label="Age" type="number" />
      );

      const input = container.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('should render tel input', () => {
      const { container } = renderWithoutRouter(
        <Input label="Phone" type="tel" />
      );

      const input = container.querySelector('input[type="tel"]');
      expect(input).toBeInTheDocument();
    });

    it('should render date input', () => {
      const { container } = renderWithoutRouter(
        <Input label="Birthday" type="date" />
      );

      const input = container.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should accept text input', async () => {
      const user = createUser();
      const { getByRole } = renderWithoutRouter(<Input label="Name" />);

      const input = getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'John Doe');

      expect(input.value).toBe('John Doe');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" onChange={handleChange} />
      );

      const input = getByRole('textbox');
      await user.type(input, 'A');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onChange for each character typed', async () => {
      const handleChange = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" onChange={handleChange} />
      );

      const input = getByRole('textbox');
      await user.type(input, 'Test');

      expect(handleChange).toHaveBeenCalledTimes(4); // T, e, s, t
    });

    it('should call onFocus when focused', async () => {
      const handleFocus = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" onFocus={handleFocus} />
      );

      const input = getByRole('textbox');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when blurred', async () => {
      const handleBlur = vi.fn();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" onBlur={handleBlur} />
      );

      const input = getByRole('textbox');
      await user.click(input);
      await user.tab(); // Move focus away

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should support controlled input', async () => {
      const handleChange = vi.fn();
      const user = createUser();
      const { getByRole, rerender } = renderWithoutRouter(
        <Input label="Name" value="Initial" onChange={handleChange} />
      );

      let input = getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Initial');

      rerender(<Input label="Name" value="Updated" onChange={handleChange} />);
      input = getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Updated');
    });

    it('should clear input value', async () => {
      const user = createUser();
      const { getByRole } = renderWithoutRouter(<Input label="Name" />);

      const input = getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'Text to clear');
      expect(input.value).toBe('Text to clear');

      await user.clear(input);
      expect(input.value).toBe('');
    });
  });

  describe('HTML Attributes', () => {
    it('should forward placeholder attribute', () => {
      const { getByPlaceholderText } = renderWithoutRouter(
        <Input placeholder="Enter your name" />
      );

      expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('should forward disabled attribute', () => {
      const { getByRole } = renderWithoutRouter(<Input label="Name" disabled />);

      expect(getByRole('textbox')).toBeDisabled();
    });

    it('should forward required attribute', () => {
      const { getByRole } = renderWithoutRouter(<Input label="Name" required />);

      expect(getByRole('textbox')).toBeRequired();
    });

    it('should forward maxLength attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" maxLength={10} />
      );

      expect(getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('should forward min and max for number inputs', () => {
      const { container } = renderWithoutRouter(
        <Input label="Age" type="number" min={0} max={120} />
      );

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '120');
    });

    it('should forward pattern attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
      );

      expect(getByRole('textbox')).toHaveAttribute(
        'pattern',
        '[0-9]{3}-[0-9]{3}-[0-9]{4}'
      );
    });

    it('should forward autoComplete attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Email" type="email" autoComplete="email" />
      );

      expect(getByRole('textbox')).toHaveAttribute('autoComplete', 'email');
    });

    it('should forward name attribute', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Username" name="username" />
      );

      expect(getByRole('textbox')).toHaveAttribute('name', 'username');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      renderWithoutRouter(<Input label="Name" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow ref to access input methods', () => {
      const ref = createRef<HTMLInputElement>();
      renderWithoutRouter(<Input label="Name" ref={ref} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });

    it('should allow ref to get input value', async () => {
      const ref = createRef<HTMLInputElement>();
      const user = createUser();
      const { getByRole } = renderWithoutRouter(<Input label="Name" ref={ref} />);

      const input = getByRole('textbox');
      await user.type(input, 'Test Value');

      expect(ref.current?.value).toBe('Test Value');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = createUser();
      const { getByRole } = renderWithoutRouter(<Input label="Name" />);

      const input = getByRole('textbox');
      await user.tab();

      expect(input).toHaveFocus();
    });

    it('should have proper label association', () => {
      const { getByLabelText } = renderWithoutRouter(
        <Input label="Email Address" />
      );

      expect(getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should announce errors to screen readers', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Email" error="Invalid email" />
      );

      const input = getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');

      expect(errorId).toBeTruthy();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should provide helper text to screen readers', () => {
      const { getByRole } = renderWithoutRouter(
        <Input label="Password" helperText="Must be 8+ characters" />
      );

      const input = getByRole('textbox');
      const helperId = input.getAttribute('aria-describedby');

      expect(helperId).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined label', () => {
      const { getByRole } = renderWithoutRouter(<Input label={undefined} />);

      expect(getByRole('textbox')).toBeInTheDocument();
    });

    it('should handle empty error string', () => {
      const { getByRole } = renderWithoutRouter(<Input label="Name" error="" />);

      expect(getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should handle very long error messages', () => {
      const longError =
        'This is a very long error message that should still be displayed correctly without breaking the layout';
      const { getByRole } = renderWithoutRouter(
        <Input label="Name" error={longError} />
      );

      expect(getByRole('alert')).toHaveTextContent(longError);
    });

    it('should handle special characters in value', async () => {
      const user = createUser();
      const { getByRole } = renderWithoutRouter(<Input label="Name" />);

      const input = getByRole('textbox') as HTMLInputElement;
      await user.type(input, '<script>alert("xss")</script>');

      expect(input.value).toBe('<script>alert("xss")</script>');
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for basic input', () => {
      const { container } = renderWithoutRouter(<Input label="Name" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for input with error', () => {
      const { container } = renderWithoutRouter(
        <Input label="Email" error="Invalid email" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for required input with helper text', () => {
      const { container } = renderWithoutRouter(
        <Input label="Password" required helperText="Must be 8+ characters" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
