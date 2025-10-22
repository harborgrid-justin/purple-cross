/**
 * WF-COMP-XXX | PermissionChecker.ts - Permission validation
 * Purpose: Check user permissions for actions and resources
 * Dependencies: none
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export enum Permission {
  // Patient permissions
  PATIENTS_VIEW = 'patients:view',
  PATIENTS_CREATE = 'patients:create',
  PATIENTS_EDIT = 'patients:edit',
  PATIENTS_DELETE = 'patients:delete',
  
  // Client permissions
  CLIENTS_VIEW = 'clients:view',
  CLIENTS_CREATE = 'clients:create',
  CLIENTS_EDIT = 'clients:edit',
  CLIENTS_DELETE = 'clients:delete',
  
  // Appointment permissions
  APPOINTMENTS_VIEW = 'appointments:view',
  APPOINTMENTS_CREATE = 'appointments:create',
  APPOINTMENTS_EDIT = 'appointments:edit',
  APPOINTMENTS_DELETE = 'appointments:delete',
  
  // Medical records permissions
  MEDICAL_RECORDS_VIEW = 'medical_records:view',
  MEDICAL_RECORDS_CREATE = 'medical_records:create',
  MEDICAL_RECORDS_EDIT = 'medical_records:edit',
  MEDICAL_RECORDS_DELETE = 'medical_records:delete',
  
  // Invoice permissions
  INVOICES_VIEW = 'invoices:view',
  INVOICES_CREATE = 'invoices:create',
  INVOICES_EDIT = 'invoices:edit',
  INVOICES_DELETE = 'invoices:delete',
  
  // Staff permissions
  STAFF_VIEW = 'staff:view',
  STAFF_CREATE = 'staff:create',
  STAFF_EDIT = 'staff:edit',
  STAFF_DELETE = 'staff:delete',
  
  // Inventory permissions
  INVENTORY_VIEW = 'inventory:view',
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_EDIT = 'inventory:edit',
  INVENTORY_DELETE = 'inventory:delete',
  
  // Analytics permissions
  ANALYTICS_VIEW = 'analytics:view',
  
  // Admin permissions
  ADMIN_ALL = 'admin:all',
}

export interface User {
  id: string;
  role: string;
  permissions: string[];
}

// ==========================================
// ROLE DEFINITIONS
// ==========================================

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [Permission.ADMIN_ALL],
  veterinarian: [
    Permission.PATIENTS_VIEW,
    Permission.PATIENTS_CREATE,
    Permission.PATIENTS_EDIT,
    Permission.CLIENTS_VIEW,
    Permission.APPOINTMENTS_VIEW,
    Permission.APPOINTMENTS_CREATE,
    Permission.APPOINTMENTS_EDIT,
    Permission.MEDICAL_RECORDS_VIEW,
    Permission.MEDICAL_RECORDS_CREATE,
    Permission.MEDICAL_RECORDS_EDIT,
    Permission.INVOICES_VIEW,
    Permission.INVOICES_CREATE,
  ],
  receptionist: [
    Permission.PATIENTS_VIEW,
    Permission.PATIENTS_CREATE,
    Permission.PATIENTS_EDIT,
    Permission.CLIENTS_VIEW,
    Permission.CLIENTS_CREATE,
    Permission.CLIENTS_EDIT,
    Permission.APPOINTMENTS_VIEW,
    Permission.APPOINTMENTS_CREATE,
    Permission.APPOINTMENTS_EDIT,
    Permission.APPOINTMENTS_DELETE,
    Permission.INVOICES_VIEW,
    Permission.INVOICES_CREATE,
    Permission.INVOICES_EDIT,
  ],
  technician: [
    Permission.PATIENTS_VIEW,
    Permission.CLIENTS_VIEW,
    Permission.APPOINTMENTS_VIEW,
    Permission.MEDICAL_RECORDS_VIEW,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_EDIT,
  ],
  viewer: [
    Permission.PATIENTS_VIEW,
    Permission.CLIENTS_VIEW,
    Permission.APPOINTMENTS_VIEW,
    Permission.MEDICAL_RECORDS_VIEW,
    Permission.INVOICES_VIEW,
    Permission.ANALYTICS_VIEW,
  ],
};

// ==========================================
// PERMISSION CHECKER CLASS
// ==========================================

class PermissionChecker {
  private currentUser: User | null = null;
  
  /**
   * Set current user
   */
  setUser(user: User | null): void {
    this.currentUser = user;
  }
  
  /**
   * Get current user
   */
  getUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Check if user has permission
   */
  hasPermission(permission: Permission | string): boolean {
    if (!this.currentUser) return false;
    
    // Admin has all permissions
    if (this.hasRole('admin')) return true;
    
    // Check if user has ADMIN_ALL permission
    if (this.currentUser.permissions.includes(Permission.ADMIN_ALL)) return true;
    
    // Check direct permission
    if (this.currentUser.permissions.includes(permission)) return true;
    
    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[this.currentUser.role] || [];
    return rolePermissions.includes(permission as Permission);
  }
  
  /**
   * Check if user has any of the permissions
   */
  hasAnyPermission(permissions: (Permission | string)[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }
  
  /**
   * Check if user has all of the permissions
   */
  hasAllPermissions(permissions: (Permission | string)[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }
  
  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
  
  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
  
  /**
   * Check if user can view resource
   */
  canView(resource: string): boolean {
    return this.hasPermission(`${resource}:view`);
  }
  
  /**
   * Check if user can create resource
   */
  canCreate(resource: string): boolean {
    return this.hasPermission(`${resource}:create`);
  }
  
  /**
   * Check if user can edit resource
   */
  canEdit(resource: string): boolean {
    return this.hasPermission(`${resource}:edit`);
  }
  
  /**
   * Check if user can delete resource
   */
  canDelete(resource: string): boolean {
    return this.hasPermission(`${resource}:delete`);
  }
  
  /**
   * Get all permissions for current user
   */
  getAllPermissions(): string[] {
    if (!this.currentUser) return [];
    
    // Combine direct permissions with role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[this.currentUser.role] || [];
    return [...new Set([...this.currentUser.permissions, ...rolePermissions])];
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const permissionChecker = new PermissionChecker();
export default permissionChecker;
