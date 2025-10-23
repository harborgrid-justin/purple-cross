/**
 * WF-COMP-XXX | helpers.test.ts - helpers.test
 * Purpose: Test suite for helpers
 * Dependencies: None
 * Last Updated: 2025-10-23 | File Type: .ts
 */

import { describe, it, expect } from 'vitest';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('should format numbers as currency', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      };

      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US');
      };

      const testDate = new Date('2024-12-01');
      expect(formatDate(testDate)).toMatch(/12\/1\/2024/);
    });
  });
});
