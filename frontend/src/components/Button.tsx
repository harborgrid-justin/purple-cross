/**
 * WF-COMP-XXX | Button.tsx - Button
 * Purpose: React component for Button functionality
 * Dependencies: react
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the Button component.
 *
 * @interface ButtonProps
 * @extends {ButtonHTMLAttributes<HTMLButtonElement>}
 *
 * @property {ReactNode} children - The content to display inside the button
 * @property {'primary' | 'secondary' | 'danger' | 'success'} [variant='primary'] - Visual style variant
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Button size
 * @property {boolean} [fullWidth=false] - Whether button should take full width of container
 * @property {boolean} [loading=false] - Loading state - shows spinner and disables button
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading={isSubmitting}>
 *   Submit Form
 * </Button>
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * Button component with multiple variants, sizes, and loading state support.
 *
 * @component
 * @param {ButtonProps} props - The component props
 * @returns {JSX.Element} Rendered button element
 *
 * @example
 * // Basic usage
 * <Button onClick={handleSave}>Save</Button>
 *
 * @example
 * // With variant and size
 * <Button variant="danger" size="lg" onClick={handleDelete}>
 *   Delete Account
 * </Button>
 *
 * @example
 * // Full width button
 * <Button fullWidth variant="primary" onClick={handleSubmit}>
 *   Submit Form
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading={isProcessing} disabled={!isValid}>
 *   Process Payment
 * </Button>
 *
 * @remarks
 * - Extends all native button HTML attributes
 * - Automatically disables button when loading={true}
 * - Uses clsx for conditional className composition
 * - Loading state shows spinner with "Loading..." text
 * - Supports custom className for additional styling
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        {
          'btn-full-width': fullWidth,
          'btn-loading': loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
