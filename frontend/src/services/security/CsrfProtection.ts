/**
 * WF-COMP-XXX | CsrfProtection.ts - CSRF protection
 * Purpose: Cross-Site Request Forgery protection
 * Dependencies: axios, SecureTokenManager
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosInstance } from 'axios';
import { secureTokenManager } from './SecureTokenManager';

// ==========================================
// CSRF PROTECTION SETUP
// ==========================================

/**
 * Setup CSRF protection for axios instance
 */
export function setupCsrfProtection(axiosInstance: AxiosInstance): void {
  // Add CSRF token to state-changing requests
  axiosInstance.interceptors.request.use(
    (config) => {
      // Only add CSRF token for state-changing methods
      const methodsRequiringCsrf = ['post', 'put', 'patch', 'delete'];
      const method = config.method?.toLowerCase();
      
      if (method && methodsRequiringCsrf.includes(method)) {
        const csrfToken = secureTokenManager.getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Store CSRF token from response headers
  axiosInstance.interceptors.response.use(
    (response) => {
      const csrfToken = response.headers['x-csrf-token'];
      if (csrfToken) {
        secureTokenManager.setCsrfToken(csrfToken);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );
}

/**
 * Generate CSRF token (client-side)
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Initialize CSRF token
 */
export function initializeCsrfToken(): void {
  const existingToken = secureTokenManager.getCsrfToken();
  if (!existingToken) {
    const token = generateCsrfToken();
    secureTokenManager.setCsrfToken(token);
  }
}

/**
 * Clear CSRF token
 */
export function clearCsrfToken(): void {
  secureTokenManager.clearCsrfToken();
}

/**
 * Get current CSRF token
 */
export function getCsrfToken(): string | null {
  return secureTokenManager.getCsrfToken();
}
