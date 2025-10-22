/**
 * WF-COMP-XXX | transformers.ts - Data transformation utilities
 * Purpose: Transform data between API and application formats
 * Dependencies: moment
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import moment from 'moment';

// ==========================================
// DATE TRANSFORMATIONS
// ==========================================

/**
 * Transform date to ISO string for API
 */
export function toISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  return moment(date).toISOString();
}

/**
 * Transform ISO string to Date
 */
export function fromISOString(isoString: string | null | undefined): Date | null {
  if (!isoString) return null;
  return moment(isoString).toDate();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | null | undefined, format = 'MM/DD/YYYY'): string {
  if (!date) return '';
  return moment(date).format(format);
}

/**
 * Format datetime for display
 */
export function formatDateTime(
  date: Date | string | null | undefined,
  format = 'MM/DD/YYYY hh:mm A'
): string {
  if (!date) return '';
  return moment(date).format(format);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  return moment(date).fromNow();
}

// ==========================================
// CURRENCY TRANSFORMATIONS
// ==========================================

/**
 * Format number as currency
 */
export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount === null || amount === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

// ==========================================
// PHONE NUMBER TRANSFORMATIONS
// ==========================================

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }

  return phone;
}

/**
 * Clean phone number for API
 */
export function cleanPhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  return phone.replace(/\D/g, '');
}

// ==========================================
// NAME TRANSFORMATIONS
// ==========================================

/**
 * Format full name from parts
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  middleName?: string | null
): string {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
}

/**
 * Get initials from name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '';

  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ==========================================
// ADDRESS TRANSFORMATIONS
// ==========================================

/**
 * Format address for display
 */
export function formatAddress(address: {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
}): string {
  const parts = [
    address.street,
    address.city,
    address.state && address.zipCode
      ? `${address.state} ${address.zipCode}`
      : address.state || address.zipCode,
    address.country && address.country !== 'US' ? address.country : null,
  ].filter(Boolean);

  return parts.join(', ');
}

// ==========================================
// ARRAY TRANSFORMATIONS
// ==========================================

/**
 * Transform array to comma-separated string
 */
export function arrayToString<T>(arr: T[] | null | undefined, separator = ', '): string {
  if (!arr || arr.length === 0) return '';
  return arr.join(separator);
}

/**
 * Transform comma-separated string to array
 */
export function stringToArray(str: string | null | undefined, separator = ','): string[] {
  if (!str) return [];
  return str
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ==========================================
// OBJECT TRANSFORMATIONS
// ==========================================

/**
 * Remove null and undefined values from object
 */
export function removeEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      (acc as Record<string, unknown>)[key] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (source) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        target[key as keyof T] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as unknown as T[keyof T];
      } else if (sourceValue !== undefined) {
        target[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  }

  return deepMerge(target, ...sources);
}

// ==========================================
// BOOLEAN TRANSFORMATIONS
// ==========================================

/**
 * Format boolean for display
 */
export function formatBoolean(
  value: boolean | null | undefined,
  trueLabel = 'Yes',
  falseLabel = 'No'
): string {
  if (value === null || value === undefined) return '';
  return value ? trueLabel : falseLabel;
}

// ==========================================
// NUMBER TRANSFORMATIONS
// ==========================================

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

// ==========================================
// STATUS TRANSFORMATIONS
// ==========================================

/**
 * Transform status to display label
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return '';

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get status color
 */
export function getStatusColor(status: string | null | undefined): string {
  if (!status) return 'gray';

  const statusLower = status.toLowerCase();

  if (['active', 'completed', 'paid', 'approved', 'success'].includes(statusLower)) {
    return 'green';
  }

  if (['pending', 'scheduled', 'partial'].includes(statusLower)) {
    return 'yellow';
  }

  if (['inactive', 'cancelled', 'failed', 'rejected', 'overdue'].includes(statusLower)) {
    return 'red';
  }

  return 'gray';
}
