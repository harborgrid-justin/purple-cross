import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

/**
 * Thin wrapper around react-hook-form that wires a Zod schema as the resolver,
 * giving every form client-side validation derived from a single source of
 * truth. Use across create/edit pages instead of hand-rolled useState forms.
 *
 * The casts bridge react-hook-form's multi-generic resolver/return signature to
 * a simple `UseFormReturn<T>` for ergonomic call sites.
 */
export function useZodForm<T extends FieldValues>(
  schema: ZodType<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
  const resolver = zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]);
  return useForm<T>({
    ...options,
    resolver,
  } as unknown as UseFormProps<T>) as UseFormReturn<T>;
}
