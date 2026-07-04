import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import { AuthorizationError, AuthenticationError } from "src/lib/errors";
import type { UserSession } from "src/lib/domain";

export type Role = "user" | "admin" | "support" | "catalog_manager";
export type ResourceAction = "create" | "read" | "update" | "delete";

export type AuthPolicy = {
  role: Role;
  resource: string;
  action: ResourceAction;
  allowed: boolean;
};

const ADMIN_ACCESS: AuthPolicy[] = [
  { role: "admin", resource: "*", action: "create", allowed: true },
  { role: "admin", resource: "*", action: "read", allowed: true },
  { role: "admin", resource: "*", action: "update", allowed: true },
  { role: "admin", resource: "*", action: "delete", allowed: true },
];

const SUPPORT_ACCESS: AuthPolicy[] = [
  { role: "support", resource: "order", action: "read", allowed: true },
  { role: "support", resource: "order", action: "update", allowed: true },
  { role: "support", resource: "user", action: "read", allowed: true },
  { role: "support", resource: "audit_log", action: "read", allowed: true },
];

const CATALOG_MANAGER_ACCESS: AuthPolicy[] = [
  { role: "catalog_manager", resource: "product", action: "create", allowed: true },
  { role: "catalog_manager", resource: "product", action: "read", allowed: true },
  { role: "catalog_manager", resource: "product", action: "update", allowed: true },
  { role: "catalog_manager", resource: "category", action: "create", allowed: true },
  { role: "catalog_manager", resource: "category", action: "read", allowed: true },
  { role: "catalog_manager", resource: "category", action: "update", allowed: true },
  { role: "catalog_manager", resource: "media", action: "create", allowed: true },
  { role: "catalog_manager", resource: "media", action: "read", allowed: true },
  { role: "catalog_manager", resource: "media", action: "delete", allowed: true },
];

const ROLE_POLICIES: Record<Role, AuthPolicy[]> = {
  admin: ADMIN_ACCESS,
  user: [],
  support: SUPPORT_ACCESS,
  catalog_manager: CATALOG_MANAGER_ACCESS,
};

export function can(
  role: Role,
  resource: string,
  action: ResourceAction
): boolean {
  const policies = ROLE_POLICIES[role] ?? [];
  const adminOverride = ROLE_POLICIES.admin.find(
    (p) => p.resource === resource && p.action === action
  );
  if (adminOverride && role === "admin") return true;

  return policies.some(
    (p) =>
      (p.resource === resource || p.resource === "*") &&
      p.action === action &&
      p.allowed
  );
}

export function isOwner(
  resourceUserId: string,
  currentUserId: string
): boolean {
  return resourceUserId === currentUserId;
}

export function requireRole(
  session: UserSession | null,
  allowedRoles: Role[]
): void {
  if (!session) {
    throw new AuthenticationError();
  }
  if (!allowedRoles.includes(session.role)) {
    throw new AuthorizationError(
      `Requires one of: ${allowedRoles.join(", ")}`
    );
  }
}

export function requireOwnerOrRole(
  session: UserSession | null,
  resourceUserId: string,
  allowedRoles: Role[] = ["admin"]
): void {
  if (!session) {
    throw new AuthenticationError();
  }
  if (isOwner(resourceUserId, session.userId)) return;
  if (allowedRoles.includes(session.role)) return;
  throw new AuthorizationError("You do not have permission to perform this action");
}

export async function getAuthSession(): Promise<UserSession | null> {
  const nextAuthSession = await getServerSession(authOptions);
  if (!nextAuthSession?.user?.id) return null;
  return {
    userId: nextAuthSession.user.id as string,
    sessionId: "",
    role: (nextAuthSession.user as Record<string, unknown>).role as Role || "user",
    accountStatus: "active",
    permissions: [],
    isSystem: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}
