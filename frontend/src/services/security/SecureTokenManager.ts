/**
 * WF-COMP-XXX | SecureTokenManager.ts - Token management
 * Purpose: Secure token storage and management
 * Dependencies: constants
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { STORAGE_KEYS } from '../../constants';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
}

// ==========================================
// SECURE TOKEN MANAGER CLASS
// ==========================================

class SecureTokenManager {
  private readonly TOKEN_KEY = STORAGE_KEYS.TOKEN;
  private readonly REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN;
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly REFRESH_EXPIRY_KEY = 'refresh_token_expiry';
  private readonly CSRF_TOKEN_KEY = 'csrf_token';
  
  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken: string, expiresIn: number): void {
    const now = Date.now();
    const expiresAt = now + expiresIn * 1000;
    const refreshExpiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days
    
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, String(expiresAt));
      localStorage.setItem(this.REFRESH_EXPIRY_KEY, String(refreshExpiresAt));
    } catch (error) {
      console.error('[SecureTokenManager] Error setting tokens:', error);
      // Fall back to sessionStorage if localStorage is full
      try {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, String(expiresAt));
        sessionStorage.setItem(this.REFRESH_EXPIRY_KEY, String(refreshExpiresAt));
      } catch (sessionError) {
        console.error('[SecureTokenManager] Error setting tokens in sessionStorage:', sessionError);
      }
    }
  }
  
  /**
   * Get authentication token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Error getting token:', error);
      return null;
    }
  }
  
  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Error getting refresh token:', error);
      return null;
    }
  }
  
  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(): boolean {
    try {
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY) || sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryStr) return false;
      
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();
      
      // Add 60 second buffer
      return expiry > now + 60000;
    } catch (error) {
      console.error('[SecureTokenManager] Error checking token validity:', error);
      return false;
    }
  }
  
  /**
   * Check if refresh token is valid (not expired)
   */
  isRefreshTokenValid(): boolean {
    try {
      const expiryStr = localStorage.getItem(this.REFRESH_EXPIRY_KEY) || sessionStorage.getItem(this.REFRESH_EXPIRY_KEY);
      if (!expiryStr) return false;
      
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();
      
      return expiry > now;
    } catch (error) {
      console.error('[SecureTokenManager] Error checking refresh token validity:', error);
      return false;
    }
  }
  
  /**
   * Check if user has valid token
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid();
  }
  
  /**
   * Clear all tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REFRESH_EXPIRY_KEY);
      localStorage.removeItem(this.CSRF_TOKEN_KEY);
      
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(this.REFRESH_EXPIRY_KEY);
      sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Error clearing tokens:', error);
    }
  }
  
  /**
   * Get time until token expiry in milliseconds
   */
  getTimeUntilExpiry(): number {
    try {
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY) || sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryStr) return 0;
      
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();
      
      return Math.max(0, expiry - now);
    } catch (error) {
      console.error('[SecureTokenManager] Error getting time until expiry:', error);
      return 0;
    }
  }
  
  /**
   * Set CSRF token
   */
  setCsrfToken(token: string): void {
    try {
      sessionStorage.setItem(this.CSRF_TOKEN_KEY, token);
    } catch (error) {
      console.error('[SecureTokenManager] Error setting CSRF token:', error);
    }
  }
  
  /**
   * Get CSRF token
   */
  getCsrfToken(): string | null {
    try {
      return sessionStorage.getItem(this.CSRF_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Error getting CSRF token:', error);
      return null;
    }
  }
  
  /**
   * Clear CSRF token
   */
  clearCsrfToken(): void {
    try {
      sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureTokenManager] Error clearing CSRF token:', error);
    }
  }
  
  /**
   * Get all token data
   */
  getTokenData(): TokenData | null {
    try {
      const token = this.getToken();
      const refreshToken = this.getRefreshToken();
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY) || sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      const refreshExpiryStr = localStorage.getItem(this.REFRESH_EXPIRY_KEY) || sessionStorage.getItem(this.REFRESH_EXPIRY_KEY);
      
      if (!token || !refreshToken || !expiryStr || !refreshExpiryStr) {
        return null;
      }
      
      return {
        token,
        refreshToken,
        expiresAt: parseInt(expiryStr, 10),
        refreshExpiresAt: parseInt(refreshExpiryStr, 10),
      };
    } catch (error) {
      console.error('[SecureTokenManager] Error getting token data:', error);
      return null;
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const secureTokenManager = new SecureTokenManager();
export default secureTokenManager;
