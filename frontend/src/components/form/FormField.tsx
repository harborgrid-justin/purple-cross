import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  required?: boolean;
  /** When provided, renders a <select> instead of an <input>. */
  options?: SelectOption[];
  placeholder?: string;
}

/**
 * Accessible, validation-aware form control bound to react-hook-form. Renders an
 * input or select, wires aria-invalid, and surfaces the Zod error message.
 */
export function FormField({
  label,
  registration,
  error,
  type = 'text',
  required = false,
  options,
  placeholder,
}: FormFieldProps): JSX.Element {
  const id = registration.name;
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {options ? (
        <select id={id} aria-invalid={!!error} aria-required={required} {...registration}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-required={required}
          {...registration}
        />
      )}
      {error?.message && (
        <span className="form-error" role="alert" style={{ color: 'var(--color-error, #dc2626)' }}>
          {error.message}
        </span>
      )}
    </div>
  );
}
