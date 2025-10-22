/**
 * WF-COMP-XXX | ErrorReporting.ts - Error tracking
 * Purpose: Track and report application errors
 * Dependencies: errorHandlers
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AppError, ErrorType } from '../utils/errorHandlers';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface ErrorReport {
  error: AppError;
  context?: string;
  userAgent: string;
  url: string;
  timestamp: number;
}

interface ErrorStats {
  totalErrors: number;
  errorsByType: Record<ErrorType, number>;
  recentErrors: ErrorReport[];
}

// ==========================================
// ERROR REPORTING CLASS
// ==========================================

class ErrorReporting {
  private errors: ErrorReport[] = [];
  private readonly maxStoredErrors = 50;
  
  /**
   * Report an error
   */
  reportError(error: AppError, context?: string): void {
    const report: ErrorReport = {
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };
    
    this.errors.push(report);
    
    // Keep only recent errors
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift();
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorReporting] Error reported:', {
        type: error.type,
        message: error.message,
        context,
        status: error.status,
      });
    }
    
    // In production, send to error tracking service
    // Example: Sentry, Rollbar, etc.
    if (import.meta.env.PROD) {
      this.sendToErrorTrackingService(report);
    }
  }
  
  /**
   * Get error statistics
   */
  getStats(): ErrorStats {
    const errorsByType = this.errors.reduce((acc, report) => {
      const type = report.error.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);
    
    const recentErrors = [...this.errors]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    
    return {
      totalErrors: this.errors.length,
      errorsByType,
      recentErrors,
    };
  }
  
  /**
   * Get errors by type
   */
  getErrorsByType(type: ErrorType): ErrorReport[] {
    return this.errors.filter(report => report.error.type === type);
  }
  
  /**
   * Get errors by context
   */
  getErrorsByContext(context: string): ErrorReport[] {
    return this.errors.filter(report => report.context === context);
  }
  
  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = [];
  }
  
  /**
   * Send error to tracking service (placeholder)
   */
  private sendToErrorTrackingService(report: ErrorReport): void {
    // Placeholder for integration with error tracking service
    // Example implementations:
    
    // Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(report.error, {
    //     tags: { type: report.error.type },
    //     contexts: { custom: { context: report.context } }
    //   });
    // }
    
    // Or send to custom backend endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report)
    // }).catch(err => console.error('Failed to send error report:', err));
    
    console.log('[ErrorReporting] Would send to tracking service:', report);
  }
  
  /**
   * Export errors as JSON
   */
  exportErrors(): string {
    return JSON.stringify({
      stats: this.getStats(),
      errors: this.errors,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  
  /**
   * Log error stats to console
   */
  logStats(): void {
    const stats = this.getStats();
    console.log('[ErrorReporting] Stats:', {
      'Total Errors': stats.totalErrors,
      'Errors by Type': stats.errorsByType,
    });
    
    if (stats.recentErrors.length > 0) {
      console.log('[ErrorReporting] Recent Errors:', stats.recentErrors.slice(0, 5));
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const errorReporting = new ErrorReporting();
export default errorReporting;
