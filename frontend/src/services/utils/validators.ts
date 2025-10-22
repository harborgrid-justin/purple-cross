/**
 * WF-COMP-XXX | validators.ts - Common validation schemas
 * Purpose: Reusable Zod validation schemas
 * Dependencies: zod
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { z } from 'zod';

// ==========================================
// COMMON PATTERNS
// ==========================================

export const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
export const URL_REGEX = /^https?:\/\/.+/;
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

// ==========================================
// PRIMITIVE SCHEMAS
// ==========================================

/**
 * ID validation schema
 */
export const idSchema = z
  .string()
  .regex(ID_REGEX, 'Invalid ID format')
  .min(1, 'ID is required');

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Phone validation schema
 */
export const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, 'Invalid phone number format')
  .trim();

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .regex(URL_REGEX, 'URL must start with http:// or https://');

/**
 * Date string validation schema
 */
export const dateStringSchema = z
  .string()
  .datetime('Invalid date format');

/**
 * Date validation schema
 */
export const dateSchema = z.coerce.date();

/**
 * Positive integer validation schema
 */
export const positiveIntSchema = z
  .number()
  .int('Must be an integer')
  .positive('Must be positive');

/**
 * Non-negative integer validation schema
 */
export const nonNegativeIntSchema = z
  .number()
  .int('Must be an integer')
  .nonnegative('Must be non-negative');

// ==========================================
// STATUS SCHEMAS
// ==========================================

/**
 * Common status values
 */
export const statusSchema = z.enum(['active', 'inactive', 'pending'], {
  errorMap: () => ({ message: 'Status must be active, inactive, or pending' })
});

/**
 * Appointment status schema
 */
export const appointmentStatusSchema = z.enum([
  'scheduled',
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'rescheduled',
]);

/**
 * Payment status schema
 */
export const paymentStatusSchema = z.enum([
  'paid',
  'unpaid',
  'partial',
  'overdue',
  'refunded',
]);

// ==========================================
// PAGINATION SCHEMAS
// ==========================================

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Search parameters schema
 */
export const searchSchema = z.object({
  search: z.string().max(100).trim().optional(),
  ...paginationSchema.shape,
});

// ==========================================
// ADDRESS SCHEMAS
// ==========================================

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200).trim(),
  city: z.string().min(1, 'City is required').max(100).trim(),
  state: z.string().length(2, 'State must be 2 characters').toUpperCase(),
  zipCode: z.string().regex(ZIP_CODE_REGEX, 'Invalid ZIP code'),
  country: z.string().max(100).default('US'),
});

// ==========================================
// COMMON FIELD SCHEMAS
// ==========================================

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name cannot exceed 100 characters')
  .trim();

/**
 * Description validation schema
 */
export const descriptionSchema = z
  .string()
  .max(500, 'Description cannot exceed 500 characters')
  .optional();

/**
 * Notes validation schema
 */
export const notesSchema = z
  .string()
  .max(2000, 'Notes cannot exceed 2000 characters')
  .optional();

/**
 * Currency amount validation schema
 */
export const currencySchema = z
  .number()
  .nonnegative('Amount must be non-negative')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places');

// ==========================================
// FILE SCHEMAS
// ==========================================

/**
 * File upload validation schema
 */
export const fileSchema = z.instanceof(File, { message: 'Invalid file' });

/**
 * Image file validation schema
 */
export const imageFileSchema = fileSchema.refine(
  (file) => file.type.startsWith('image/'),
  { message: 'File must be an image' }
);

/**
 * PDF file validation schema
 */
export const pdfFileSchema = fileSchema.refine(
  (file) => file.type === 'application/pdf',
  { message: 'File must be a PDF' }
);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Create a required string schema with custom constraints
 */
export function requiredString(options?: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
}) {
  let schema = z.string().min(1, 'This field is required').trim();
  
  if (options?.minLength) {
    schema = schema.min(options.minLength, `Minimum ${options.minLength} characters required`);
  }
  
  if (options?.maxLength) {
    schema = schema.max(options.maxLength, `Maximum ${options.maxLength} characters allowed`);
  }
  
  if (options?.pattern) {
    schema = schema.regex(options.pattern, options.patternMessage || 'Invalid format');
  }
  
  return schema;
}

/**
 * Create an optional string schema with custom constraints
 */
export function optionalString(options?: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
}) {
  let schema = z.string().trim().optional();
  
  if (options?.minLength) {
    schema = schema.refine(
      (val) => !val || val.length >= options.minLength!,
      { message: `Minimum ${options.minLength} characters required` }
    );
  }
  
  if (options?.maxLength) {
    schema = schema.refine(
      (val) => !val || val.length <= options.maxLength!,
      { message: `Maximum ${options.maxLength} characters allowed` }
    );
  }
  
  if (options?.pattern) {
    schema = schema.refine(
      (val) => !val || options.pattern!.test(val),
      { message: options.patternMessage || 'Invalid format' }
    );
  }
  
  return schema;
}

/**
 * Create an enum schema with custom error message
 */
export function enumSchema<T extends [string, ...string[]]>(
  values: T,
  errorMessage?: string
) {
  return z.enum(values, {
    errorMap: () => ({
      message: errorMessage || `Value must be one of: ${values.join(', ')}`
    })
  });
}
