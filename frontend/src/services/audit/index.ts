/**
 * WF-COMP-XXX | audit/index.ts - Audit service
 * Purpose: Track user actions for audit trail
 * Dependencies: none
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum AuditResourceType {
  PATIENT = 'PATIENT',
  CLIENT = 'CLIENT',
  APPOINTMENT = 'APPOINTMENT',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  PRESCRIPTION = 'PRESCRIPTION',
  INVOICE = 'INVOICE',
  STAFF = 'STAFF',
  INVENTORY = 'INVENTORY',
  DOCUMENT = 'DOCUMENT',
  COMMUNICATION = 'COMMUNICATION',
  LAB_TEST = 'LAB_TEST',
  USER = 'USER',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
}

export interface AuditEntry {
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId: string;
  status: AuditStatus;
  timestamp: number;
  userId?: string;
  details?: Record<string, unknown>;
  error?: string;
}

// ==========================================
// AUDIT SERVICE CLASS
// ==========================================

class AuditService {
  private entries: AuditEntry[] = [];
  private readonly maxEntries = 1000;
  private userId: string | null = null;
  
  /**
   * Set current user ID
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }
  
  /**
   * Log an audit action
   */
  async logAction(entry: Omit<AuditEntry, 'timestamp' | 'userId'>): Promise<void> {
    const auditEntry: AuditEntry = {
      ...entry,
      timestamp: Date.now(),
      userId: this.userId || undefined,
    };
    
    this.entries.push(auditEntry);
    
    // Keep only recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('[AuditService] Action logged:', auditEntry);
    }
    
    // In production, send to backend audit service
    if (import.meta.env.PROD) {
      this.sendToBackend(auditEntry);
    }
  }
  
  /**
   * Get audit entries
   */
  getEntries(filters?: {
    action?: AuditAction;
    resourceType?: AuditResourceType;
    status?: AuditStatus;
    userId?: string;
  }): AuditEntry[] {
    let entries = [...this.entries];
    
    if (filters) {
      if (filters.action) {
        entries = entries.filter(e => e.action === filters.action);
      }
      if (filters.resourceType) {
        entries = entries.filter(e => e.resourceType === filters.resourceType);
      }
      if (filters.status) {
        entries = entries.filter(e => e.status === filters.status);
      }
      if (filters.userId) {
        entries = entries.filter(e => e.userId === filters.userId);
      }
    }
    
    return entries;
  }
  
  /**
   * Get recent entries
   */
  getRecentEntries(count = 10): AuditEntry[] {
    return [...this.entries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
  }
  
  /**
   * Send audit entry to backend (placeholder)
   */
  private async sendToBackend(entry: AuditEntry): Promise<void> {
    // Placeholder for sending to backend
    // In a real implementation, this would make an API call
    // fetch('/api/audit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry)
    // }).catch(err => console.error('Failed to send audit entry:', err));
    
    console.log('[AuditService] Would send to backend:', entry);
  }
  
  /**
   * Export entries as JSON
   */
  exportEntries(): string {
    return JSON.stringify(this.entries, null, 2);
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const auditService = new AuditService();
export default auditService;
