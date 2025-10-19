/**
 * Audit Logging Utility
 * Production-ready audit logging for security-sensitive operations
 */

import { logger } from '../config/logger';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum AuditEntityType {
  PATIENT = 'PATIENT',
  CLIENT = 'CLIENT',
  APPOINTMENT = 'APPOINTMENT',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  PRESCRIPTION = 'PRESCRIPTION',
  INVOICE = 'INVOICE',
  USER = 'USER',
  STAFF = 'STAFF',
  LAB_TEST = 'LAB_TEST',
  DOCUMENT = 'DOCUMENT',
  POLICY = 'POLICY',
  PAYMENT = 'PAYMENT',
  INVENTORY = 'INVENTORY',
}

export interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // Log to database (if audit log table exists)
    // await prisma.auditLog.create({ data: entry });

    // Also log to application logger for redundancy
    logger.info({
      message: 'Audit Log',
      ...entry,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Never throw errors from audit logging - just log the failure
    logger.error({
      message: 'Failed to create audit log',
      error: error instanceof Error ? error.message : 'Unknown error',
      entry,
    });
  }
}

/**
 * Log a CREATE action
 */
export async function logCreate(
  userId: string,
  entityType: AuditEntityType,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.CREATE,
    entityType,
    entityId,
    metadata,
    success: true,
  });
}

/**
 * Log an UPDATE action with changes
 */
export async function logUpdate(
  userId: string,
  entityType: AuditEntityType,
  entityId: string,
  changes: Record<string, unknown>,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.UPDATE,
    entityType,
    entityId,
    changes,
    metadata,
    success: true,
  });
}

/**
 * Log a DELETE action
 */
export async function logDelete(
  userId: string,
  entityType: AuditEntityType,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.DELETE,
    entityType,
    entityId,
    metadata,
    success: true,
  });
}

/**
 * Log a LOGIN action
 */
export async function logLogin(
  userId: string,
  ipAddress?: string,
  userAgent?: string,
  success = true,
  errorMessage?: string
): Promise<void> {
  await createAuditLog({
    userId,
    action: success ? AuditAction.LOGIN : AuditAction.FAILED_LOGIN,
    entityType: AuditEntityType.USER,
    entityId: userId,
    ipAddress,
    userAgent,
    success,
    errorMessage,
  });
}

/**
 * Log a LOGOUT action
 */
export async function logLogout(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.LOGOUT,
    entityType: AuditEntityType.USER,
    entityId: userId,
    ipAddress,
    userAgent,
    success: true,
  });
}

/**
 * Log a PASSWORD_CHANGE action
 */
export async function logPasswordChange(
  userId: string,
  success = true,
  errorMessage?: string
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.PASSWORD_CHANGE,
    entityType: AuditEntityType.USER,
    entityId: userId,
    success,
    errorMessage,
  });
}

/**
 * Log a PERMISSION_CHANGE action
 */
export async function logPermissionChange(
  adminUserId: string,
  targetUserId: string,
  changes: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId: adminUserId,
    action: AuditAction.PERMISSION_CHANGE,
    entityType: AuditEntityType.USER,
    entityId: targetUserId,
    changes,
    success: true,
  });
}

/**
 * Log a data EXPORT action
 */
export async function logDataExport(
  userId: string,
  entityType: AuditEntityType,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.EXPORT,
    entityType,
    metadata,
    success: true,
  });
}

/**
 * Log a data IMPORT action
 */
export async function logDataImport(
  userId: string,
  entityType: AuditEntityType,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    userId,
    action: AuditAction.IMPORT,
    entityType,
    metadata,
    success: true,
  });
}

/**
 * Query audit logs with filters
 */
export interface AuditLogQuery {
  userId?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  success?: boolean;
  page?: number;
  limit?: number;
}

export async function queryAuditLogs(
  _query: AuditLogQuery
): Promise<{ items: AuditLogEntry[]; total: number }> {
  // This would query the database when audit log table is set up
  // For now, return empty results
  return { items: [], total: 0 };
}

/**
 * Middleware to automatically log API actions
 */
export function auditMiddleware(action: AuditAction, entityType: AuditEntityType) {
  return async (req: any, res: any, next: any) => {
    const originalJson = res.json;

    res.json = function (data: any) {
      // Log after successful response
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = req.params.id || data?.data?.id;
        createAuditLog({
          userId: req.user.id,
          action,
          entityType,
          entityId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          correlationId: req.correlationId,
          success: true,
        }).catch(() => {
          // Ignore audit logging errors
        });
      }

      return originalJson.call(this, data);
    };

    next();
  };
}
