/**
 * Input Validation Utilities
 * Production-ready validation helpers for common patterns
 */

import { AppError } from '../middleware/error-handler';
import { HTTP_STATUS } from '../constants';

/**
 * Validate required fields in an object
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(', ')}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (US format)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Matches formats: (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Validate date is within a range
 */
export function validateDateRange(date: Date, minDate: Date, maxDate: Date): boolean {
  const dateTime = date.getTime();
  return dateTime >= minDate.getTime() && dateTime <= maxDate.getTime();
}

/**
 * Validate string length
 */
export function validateStringLength(str: string, min: number, max: number): boolean {
  const length = str.length;
  return length >= min && length <= max;
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(num: number): boolean {
  return num > 0 && !isNaN(num) && isFinite(num);
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate enum value
 */
export function validateEnumValue<T>(value: string, enumObj: T): boolean {
  return Object.values(enumObj as Record<string, string>).includes(value);
}

/**
 * Sanitize and validate pagination parameters
 */
export function validatePagination(
  page?: number,
  limit?: number
): {
  page: number;
  limit: number;
} {
  const validPage = page && page > 0 ? Math.floor(page) : 1;
  const validLimit = limit && limit > 0 && limit <= 100 ? Math.floor(limit) : 10;

  return { page: validPage, limit: validLimit };
}

/**
 * Validate ID parameter
 */
export function validateId(id: unknown): string {
  if (typeof id !== 'string' || !id.trim()) {
    throw new AppError('Invalid ID provided', HTTP_STATUS.BAD_REQUEST);
  }
  return id.trim();
}

/**
 * Validate and sanitize search query
 */
export function validateSearchQuery(query: unknown): string {
  if (typeof query !== 'string') {
    return '';
  }

  // Remove excessive whitespace and limit length
  const sanitized = query.trim().substring(0, 200);

  // Remove potentially dangerous characters
  return sanitized.replace(/[<>{}]/g, '');
}

/**
 * Validate password strength
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

export function validateFile(
  file: { size: number; originalname: string; mimetype: string },
  options: FileValidationOptions = {}
): void {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedExtensions = [],
    allowedMimeTypes = [],
  } = options;

  // Validate file size
  if (file.size > maxSize) {
    throw new AppError(
      `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Validate file extension
  if (allowedExtensions.length > 0) {
    const fileExt = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new AppError(
        `File extension must be one of: ${allowedExtensions.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  // Validate MIME type
  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError(
      `File type must be one of: ${allowedMimeTypes.join(', ')}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
}

/**
 * Validate array of IDs
 */
export function validateIds(ids: unknown, minLength = 1, maxLength = 100): string[] {
  if (!Array.isArray(ids)) {
    throw new AppError('Invalid IDs array', HTTP_STATUS.BAD_REQUEST);
  }

  if (ids.length < minLength || ids.length > maxLength) {
    throw new AppError(
      `Array length must be between ${minLength} and ${maxLength}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const validIds = ids.filter((id) => typeof id === 'string' && id.trim());

  if (validIds.length !== ids.length) {
    throw new AppError('Some IDs are invalid', HTTP_STATUS.BAD_REQUEST);
  }

  return validIds;
}
