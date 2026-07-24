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
