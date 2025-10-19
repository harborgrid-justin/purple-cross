/**
 * Tests for validation utilities
 */

import {
  validateRequiredFields,
  validateEmail,
  validatePhoneNumber,
  validateFutureDate,
  validateStringLength,
  validatePositiveNumber,
  validateUUID,
  validatePagination,
  validateId,
  validateSearchQuery,
  validatePassword,
  validateIds,
} from '../../../src/utils/validation';
import { AppError } from '../../../src/middleware/error-handler';

describe('Validation Utilities', () => {
  describe('validateRequiredFields', () => {
    it('should not throw for valid data', () => {
      const data = { name: 'John', age: 30 };
      expect(() => validateRequiredFields(data, ['name', 'age'])).not.toThrow();
    });

    it('should throw for missing fields', () => {
      const data = { name: 'John' };
      expect(() => validateRequiredFields(data, ['name', 'age'])).toThrow(AppError);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('123-456-7890')).toBe(true);
      expect(validatePhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abc-def-ghij')).toBe(false);
    });
  });

  describe('validateFutureDate', () => {
    it('should validate future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(validateFutureDate(futureDate)).toBe(true);
    });

    it('should reject past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(validateFutureDate(pastDate)).toBe(false);
    });
  });

  describe('validateStringLength', () => {
    it('should validate correct length', () => {
      expect(validateStringLength('hello', 3, 10)).toBe(true);
    });

    it('should reject incorrect length', () => {
      expect(validateStringLength('hi', 3, 10)).toBe(false);
      expect(validateStringLength('very long string', 3, 10)).toBe(false);
    });
  });

  describe('validatePositiveNumber', () => {
    it('should validate positive numbers', () => {
      expect(validatePositiveNumber(1)).toBe(true);
      expect(validatePositiveNumber(100)).toBe(true);
    });

    it('should reject non-positive numbers', () => {
      expect(validatePositiveNumber(0)).toBe(false);
      expect(validatePositiveNumber(-1)).toBe(false);
      expect(validatePositiveNumber(NaN)).toBe(false);
    });
  });

  describe('validateUUID', () => {
    it('should validate correct UUID', () => {
      expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(validateUUID('not-a-uuid')).toBe(false);
      expect(validateUUID('550e8400-e29b-41d4')).toBe(false);
    });
  });

  describe('validatePagination', () => {
    it('should return default values for invalid input', () => {
      expect(validatePagination()).toEqual({ page: 1, limit: 10 });
      expect(validatePagination(0, 0)).toEqual({ page: 1, limit: 10 });
    });

    it('should validate and sanitize pagination', () => {
      expect(validatePagination(2, 20)).toEqual({ page: 2, limit: 20 });
      expect(validatePagination(2.7, 20.3)).toEqual({ page: 2, limit: 20 });
    });

    it('should enforce max limit', () => {
      expect(validatePagination(1, 200)).toEqual({ page: 1, limit: 10 });
    });
  });

  describe('validateId', () => {
    it('should validate correct ID', () => {
      expect(validateId('123')).toBe('123');
      expect(validateId('  123  ')).toBe('123');
    });

    it('should throw for invalid ID', () => {
      expect(() => validateId('')).toThrow(AppError);
      expect(() => validateId(null)).toThrow(AppError);
      expect(() => validateId(undefined)).toThrow(AppError);
    });
  });

  describe('validateSearchQuery', () => {
    it('should sanitize search query', () => {
      expect(validateSearchQuery('hello world')).toBe('hello world');
      expect(validateSearchQuery('  hello  ')).toBe('hello');
    });

    it('should remove dangerous characters', () => {
      expect(validateSearchQuery('<script>')).toBe('script');
      expect(validateSearchQuery('test{}test')).toBe('testtest');
    });

    it('should handle non-string input', () => {
      expect(validateSearchQuery(123)).toBe('');
      expect(validateSearchQuery(null)).toBe('');
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should provide specific error messages', () => {
      const result = validatePassword('short');
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });

  describe('validateIds', () => {
    it('should validate array of IDs', () => {
      const result = validateIds(['1', '2', '3']);
      expect(result).toEqual(['1', '2', '3']);
    });

    it('should throw for non-array', () => {
      expect(() => validateIds('not-an-array')).toThrow(AppError);
    });

    it('should throw for invalid array length', () => {
      expect(() => validateIds([])).toThrow(AppError);
      const tooMany = Array(101).fill('id');
      expect(() => validateIds(tooMany)).toThrow(AppError);
    });

    it('should throw for invalid IDs in array', () => {
      expect(() => validateIds(['1', '', '3'])).toThrow(AppError);
    });
  });
});
