import { z } from "zod";
import { RoleInput, StatusInput, CurrencyInput } from "src/lib/validations";

export type UserWithRoles = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "support" | "catalog_manager";
  status: "active" | "suspended" | "pending_verification";
  permissions: string[];
  isSystem: boolean;
};

export type UserSession = {
  userId: string;
  sessionId: string;
  role: "user" | "admin" | "support" | "catalog_manager";
  accountStatus: "active" | "suspended" | "pending_verification";
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  expiresAt: Date;
};

export type Permission = {
  id: string;
  name: string;
  resource: string;
  action: "create" | "read" | "update" | "delete";
  description: string;
};

export type AuthPolicy = {
  role: "user" | "admin" | "support" | "catalog_manager";
  resource: string;
  action: "create" | "read" | "update" | "delete";
  allowed: boolean;
  conditions?: AuthCondition[];
};

export type AuthCondition = {
  field: string;
  operator: "equals" | "greater_than" | "less_than" | "in" | "not_in";
  value: string | number | string[];
};

export class RoleService {
  private roles: Map<string, RoleInput> = new Map();

  createRole(role: RoleInput): RoleInput {
    if (this.roles.has(role.id)) {
      throw new Error(`Role with ID ${role.id} already exists`);
    }
    
    // Prevent modification of system roles
    if (role.isSystem) {
      throw new Error("Cannot create new system roles");
    }
    
    this.roles.set(role.id, role);
    return role;
  }

  getRole(id: string): RoleInput | undefined {
    return this.roles.get(id);
  }

  updateRole(id: string, updates: Partial<RoleInput>): RoleInput {
    const role = this.roles.get(id);
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }
    
    // Prevent modification of system roles
    if (role.isSystem) {
      throw new Error("Cannot modify system roles");
    }
    
    const updatedRole = { ...role, ...updates };
    this.roles.set(id, updatedRole);
    return updatedRole;
  }

  deleteRole(id: string): boolean {
    const role = this.roles.get(id);
    if (!role) {
      return false;
    }
    
    // Prevent deletion of system roles
    if (role.isSystem) {
      throw new Error("Cannot delete system roles");
    }
    
    return this.roles.delete(id);
  }

  listRoles(): RoleInput[] {
    return Array.from(this.roles.values());
  }

  checkPermission(userRole: RoleInput, resource: string, action: string): boolean {
    // Admin role has all permissions
    if (userRole.name === "admin") {
      return true;
    }
    
    // Check for explicit permission
    return userRole.permissions.some(
      perm => perm === `${resource}:${action}` || perm === `*:*`
    );
  }
}

export class StatusService {
  private statuses: Map<string, StatusInput> = new Map();

  createStatus(status: StatusInput): StatusInput {
    if (this.statuses.has(status.id)) {
      throw new Error(`Status with ID ${status.id} already exists`);
    }
    
    this.statuses.set(status.id, status);
    return status;
  }

  getStatus(id: string): StatusInput | undefined {
    return this.statuses.get(id);
  }

  updateStatus(id: string, updates: Partial<StatusInput>): StatusInput {
    const status = this.statuses.get(id);
    if (!status) {
      throw new Error(`Status with ID ${id} not found`);
    }
    
    const updatedStatus = { ...status, ...updates };
    this.statuses.set(id, updatedStatus);
    return updatedStatus;
  }

  deleteStatus(id: string): boolean {
    return this.statuses.delete(id);
  }

  listStatuses(): StatusInput[] {
    return Array.from(this.statuses.values());
  }

  validateStatusTransition(currentStatus: StatusInput, newStatus: StatusInput): boolean {
    // Allow transition to any status for now
    // In a real implementation, this would check workflow rules
    return true;
  }
}

export class CurrencyService {
  private currencies: Map<string, CurrencyInput> = new Map();

  createCurrency(currency: CurrencyInput): CurrencyInput {
    if (this.currencies.has(currency.code)) {
      throw new Error(`Currency with code ${currency.code} already exists`);
    }
    
    this.currencies.set(currency.code, currency);
    return currency;
  }

  getCurrency(code: string): CurrencyInput | undefined {
    return this.currencies.get(code);
  }

  updateCurrency(code: string, updates: Partial<CurrencyInput>): CurrencyInput {
    const currency = this.currencies.get(code);
    if (!currency) {
      throw new Error(`Currency with code ${code} not found`);
    }
    
    const updatedCurrency = { ...currency, ...updates };
    this.currencies.set(code, updatedCurrency);
    return updatedCurrency;
  }

  deleteCurrency(code: string): boolean {
    return this.currencies.delete(code);
  }

  listCurrencies(): CurrencyInput[] {
    return Array.from(this.currencies.values());
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string, rate: number): number {
    return amount * rate;
  }
}

export class PermissionService {
  private permissions: Permission[] = [
    { id: "perm-1", name: "Create Order", resource: "order", action: "create", description: "Create new orders" },
    { id: "perm-2", name: "Read Order", resource: "order", action: "read", description: "View order details" },
    { id: "perm-3", name: "Update Order", resource: "order", action: "update", description: "Modify orders" },
    { id: "perm-4", name: "Delete Order", resource: "order", action: "delete", description: "Remove orders" },
    { id: "perm-5", name: "Create Product", resource: "product", action: "create", description: "Add new products" },
    { id: "perm-6", name: "Read Product", resource: "product", action: "read", description: "View product details" },
    { id: "perm-7", name: "Update Product", resource: "product", action: "update", description: "Modify products" },
    { id: "perm-8", name: "Delete Product", resource: "product", action: "delete", description: "Remove products" },
    { id: "perm-9", name: "Manage Users", resource: "user", action: "create", description: "Create and manage users" },
    { id: "perm-10", name: "View Analytics", resource: "analytics", action: "read", description: "View system analytics" },
  ];

  getPermission(id: string): Permission | undefined {
    return this.permissions.find(p => p.id === id);
  }

  getPermissions(resource?: string, action?: string): Permission[] {
    return this.permissions.filter(p => {
      if (resource && action) {
        return p.resource === resource && p.action === action;
      } else if (resource) {
        return p.resource === resource;
      } else if (action) {
        return p.action === action;
      }
      return true;
    });
  }

  createPermission(permission: Permission): Permission {
    if (this.permissions.some(p => p.id === permission.id)) {
      throw new Error(`Permission with ID ${permission.id} already exists`);
    }
    this.permissions.push(permission);
    return permission;
  }
}

export class SessionService {
  private sessions: Map<string, UserSession> = new Map();
  private userSessions: Map<string, string[]> = new Map(); // userId -> sessionIds

  createSession(user: UserWithRoles): UserSession {
    const sessionId = this.generateSessionId();
    
    const session: UserSession = {
      userId: user.id,
      sessionId,
      role: user.role,
      accountStatus: "active", // Default status
      permissions: user.permissions,
      isSystem: user.isSystem,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
    
    this.sessions.set(sessionId, session);
    
    if (!this.userSessions.has(user.id)) {
      this.userSessions.set(user.id, []);
    }
    this.userSessions.get(user.id)!.push(sessionId);
    
    return session;
  }

  validateSession(sessionId: string): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    if (session.expiresAt < new Date()) {
      this.invalidateSession(sessionId);
      return null;
    }
    
    return session;
  }

  invalidateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    
    // Remove from user sessions mapping
    const userSessionIds = this.userSessions.get(session.userId);
    if (userSessionIds) {
      const index = userSessionIds.indexOf(sessionId);
      if (index > -1) {
        userSessionIds.splice(index, 1);
      }
    }
    
    return this.sessions.delete(sessionId);
  }

  getUserSessions(userId: string): UserSession[] {
    const sessionIds = this.userSessions.get(userId) || [];
    return sessionIds
      .map(id => this.sessions.get(id))
      .filter((session): session is UserSession => session !== undefined);
  }

  extendSession(sessionId: string, extraHours: number = 24): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    session.expiresAt = new Date(Date.now() + extraHours * 60 * 60 * 1000);
    return session;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const roleService = new RoleService();
export const statusService = new StatusService();
export const currencyService = new CurrencyService();
export const permissionService = new PermissionService();
export const sessionService = new SessionService();