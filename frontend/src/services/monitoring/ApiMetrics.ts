/**
 * WF-COMP-XXX | ApiMetrics.ts - Performance metrics
 * Purpose: Track and report API performance metrics
 * Dependencies: none
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { AxiosError } from 'axios';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface RequestMetric {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
}

interface ErrorMetric {
  url: string;
  method: string;
  status?: number;
  message: string;
  timestamp: number;
}

interface MetricsSummary {
  totalRequests: number;
  totalErrors: number;
  averageDuration: number;
  requestsByStatus: Record<number, number>;
  slowestRequests: RequestMetric[];
  recentErrors: ErrorMetric[];
}

// ==========================================
// API METRICS CLASS
// ==========================================

class ApiMetrics {
  private requests: RequestMetric[] = [];
  private errors: ErrorMetric[] = [];
  private readonly maxStoredMetrics = 100;
  
  /**
   * Record a successful request
   */
  recordRequest(url: string, status: number, duration: number, method = 'GET'): void {
    const metric: RequestMetric = {
      url,
      method,
      status,
      duration,
      timestamp: Date.now(),
    };
    
    this.requests.push(metric);
    
    // Keep only recent metrics
    if (this.requests.length > this.maxStoredMetrics) {
      this.requests.shift();
    }
    
    // Log slow requests in development
    if (import.meta.env.DEV && duration > 2000) {
      console.warn(`[ApiMetrics] Slow request detected: ${method} ${url} took ${duration}ms`);
    }
  }
  
  /**
   * Record an error
   */
  recordError(error: AxiosError): void {
    const metric: ErrorMetric = {
      url: error.config?.url || 'unknown',
      method: error.config?.method?.toUpperCase() || 'unknown',
      status: error.response?.status,
      message: error.message,
      timestamp: Date.now(),
    };
    
    this.errors.push(metric);
    
    // Keep only recent errors
    if (this.errors.length > this.maxStoredMetrics) {
      this.errors.shift();
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`[ApiMetrics] Request error: ${metric.method} ${metric.url}`, {
        status: metric.status,
        message: metric.message,
      });
    }
  }
  
  /**
   * Get metrics summary
   */
  getSummary(): MetricsSummary {
    const totalRequests = this.requests.length;
    const totalErrors = this.errors.length;
    
    // Calculate average duration
    const averageDuration = totalRequests > 0
      ? this.requests.reduce((sum, req) => sum + req.duration, 0) / totalRequests
      : 0;
    
    // Count requests by status
    const requestsByStatus = this.requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Get slowest requests
    const slowestRequests = [...this.requests]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
    
    // Get recent errors
    const recentErrors = [...this.errors]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    
    return {
      totalRequests,
      totalErrors,
      averageDuration,
      requestsByStatus,
      slowestRequests,
      recentErrors,
    };
  }
  
  /**
   * Get requests by URL pattern
   */
  getRequestsByUrl(urlPattern: string): RequestMetric[] {
    return this.requests.filter(req => req.url.includes(urlPattern));
  }
  
  /**
   * Get errors by URL pattern
   */
  getErrorsByUrl(urlPattern: string): ErrorMetric[] {
    return this.errors.filter(err => err.url.includes(urlPattern));
  }
  
  /**
   * Get error rate
   */
  getErrorRate(): number {
    const total = this.requests.length + this.errors.length;
    return total > 0 ? this.errors.length / total : 0;
  }
  
  /**
   * Get requests per second (last minute)
   */
  getRequestsPerSecond(): number {
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = this.requests.filter(req => req.timestamp > oneMinuteAgo);
    return recentRequests.length / 60;
  }
  
  /**
   * Clear all metrics
   */
  clear(): void {
    this.requests = [];
    this.errors = [];
  }
  
  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      summary: this.getSummary(),
      requests: this.requests,
      errors: this.errors,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  
  /**
   * Log metrics summary to console
   */
  logSummary(): void {
    const summary = this.getSummary();
    console.log('[ApiMetrics] Summary:', {
      'Total Requests': summary.totalRequests,
      'Total Errors': summary.totalErrors,
      'Average Duration': `${summary.averageDuration.toFixed(2)}ms`,
      'Error Rate': `${(this.getErrorRate() * 100).toFixed(2)}%`,
      'Requests/Second': this.getRequestsPerSecond().toFixed(2),
      'Requests by Status': summary.requestsByStatus,
    });
    
    if (summary.slowestRequests.length > 0) {
      console.log('[ApiMetrics] Slowest Requests:', summary.slowestRequests.slice(0, 5));
    }
    
    if (summary.recentErrors.length > 0) {
      console.log('[ApiMetrics] Recent Errors:', summary.recentErrors.slice(0, 5));
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const apiMetrics = new ApiMetrics();
export default apiMetrics;
