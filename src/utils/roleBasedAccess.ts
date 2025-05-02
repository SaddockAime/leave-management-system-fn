export enum UserRole {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_STAFF = 'ROLE_STAFF'
}

export interface Permission {
  resource: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ROLE_ADMIN]: [
    { resource: 'leave_request', actions: ['create', 'read', 'update', 'delete', 'approve', 'reject'] },
    { resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'department', actions: ['create', 'read', 'update', 'delete'] },
  ],
  [UserRole.ROLE_MANAGER]: [
    { resource: 'leave_request', actions: ['read', 'approve', 'reject'] },
    { resource: 'user', actions: ['read'] },
    { resource: 'department', actions: ['read'] },
  ],
  [UserRole.ROLE_STAFF]: [
    { resource: 'leave_request', actions: ['create', 'read'] },
    { resource: 'user', actions: ['read', 'update'] },
  ]
};

// Flexible role-based access control
export function hasPermission(role: UserRole, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.some(
    permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
  );
}

// Utility to filter allowed actions
export function getAllowedActions(role: UserRole, resource: string): string[] {
  const permissions = ROLE_PERMISSIONS[role] || [];
  const resourcePermissions = permissions.find(p => p.resource === resource);
  return resourcePermissions ? resourcePermissions.actions : [];
}

export class AccessControl {
  static canPerform(role: UserRole, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.some(
      permission => 
        permission.resource === resource && 
        permission.actions.includes(action)
    );
  }

  static filterAllowedActions(role: UserRole, resource: string, actions: string[]): string[] {
    return actions.filter(action => this.canPerform(role, resource, action));
  }
}

export function withRoleCheck<T extends (...args: any[]) => any>(
  role: UserRole, 
  resource: string, 
  action: string, 
  fn: T
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!AccessControl.canPerform(role, resource, action)) {
      throw new Error(`Unauthorized: ${role} cannot ${action} on ${resource}`);
    }
    return fn(...args);
  }) as T;
}

export function createRoleBasedHook(role: UserRole) {
  return {
    canCreate: (resource: string) => AccessControl.canPerform(role, resource, 'create'),
    canRead: (resource: string) => AccessControl.canPerform(role, resource, 'read'),
    canUpdate: (resource: string) => AccessControl.canPerform(role, resource, 'update'),
    canDelete: (resource: string) => AccessControl.canPerform(role, resource, 'delete'),
    canApprove: (resource: string) => AccessControl.canPerform(role, resource, 'approve'),
    canReject: (resource: string) => AccessControl.canPerform(role, resource, 'reject'),
  };
}
