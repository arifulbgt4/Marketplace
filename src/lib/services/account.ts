import { randomBytes, createHash } from "crypto";
import { prisma } from "src/lib/prisma";
import {
  NotFoundError,
  ValidationError,
  AuthenticationError,
} from "src/lib/errors";

const TOKEN_EXPIRY_HOURS = 24;
const TOKEN_BYTES = 32;

export class AccountService {
  async preparePasswordReset(email: string): Promise<{
    token: string;
    shouldSend: boolean;
  }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (!user)
      return {
        token: randomBytes(TOKEN_BYTES).toString("hex"),
        shouldSend: false,
      };
    return {
      token: await this.generatePasswordResetToken(normalizedEmail),
      shouldSend: true,
    };
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    const raw = randomBytes(TOKEN_BYTES).toString("hex");
    // Return an indistinguishable value so callers cannot enumerate accounts.
    if (!user) return raw;
    const hashed = this.hashToken(raw);
    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    await prisma.resetToken.upsert({
      where: { userId: user.id },
      create: { userId: user.id, token: hashed, expiresAt },
      update: { token: hashed, expiresAt, used: false },
    });

    return raw;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashed = this.hashToken(token);
    const record = await prisma.resetToken.findUnique({
      where: { token: hashed },
    });
    if (!record) throw new ValidationError("Invalid or expired reset token");
    if (record.used)
      throw new ValidationError("Reset token has already been used");
    if (record.expiresAt < new Date()) {
      throw new ValidationError("Reset token has expired");
    }
    if (newPassword.length < 12)
      throw new ValidationError("Password must be at least 12 characters");

    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction(async (tx) => {
      const consumed = await tx.resetToken.updateMany({
        where: { id: record.id, used: false, expiresAt: { gt: new Date() } },
        data: { used: true },
      });
      if (consumed.count !== 1)
        throw new ValidationError("Invalid or expired reset token");
      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword, sessionVersion: { increment: 1 } },
      });
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User", userId);

    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      throw new AuthenticationError("Current password is incorrect");
    if (newPassword.length < 12)
      throw new ValidationError("Password must be at least 12 characters");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, sessionVersion: { increment: 1 } },
    });
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    const raw = randomBytes(TOKEN_BYTES).toString("hex");
    const hashed = this.hashToken(raw);
    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    await prisma.verificationToken.upsert({
      where: { userId },
      create: { userId, token: hashed, expiresAt },
      update: { token: hashed, expiresAt, used: false },
    });

    return raw;
  }

  async prepareEmailVerification(email: string): Promise<{
    token: string;
    shouldSend: boolean;
  }> {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, status: true },
    });
    if (!user || user.status === "active")
      return {
        token: randomBytes(TOKEN_BYTES).toString("hex"),
        shouldSend: false,
      };
    return {
      token: await this.generateEmailVerificationToken(user.id),
      shouldSend: true,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const hashed = this.hashToken(token);
    const record = await prisma.verificationToken.findUnique({
      where: { token: hashed },
    });
    if (!record)
      throw new ValidationError("Invalid or expired verification token");
    if (record.used)
      throw new ValidationError("Verification token has already been used");
    if (record.expiresAt < new Date()) {
      throw new ValidationError("Verification token has expired");
    }

    await prisma.$transaction(async (tx) => {
      const consumed = await tx.verificationToken.updateMany({
        where: { id: record.id, used: false, expiresAt: { gt: new Date() } },
        data: { used: true },
      });
      if (consumed.count !== 1)
        throw new ValidationError("Invalid or expired verification token");
      await tx.user.update({
        where: { id: record.userId },
        data: { status: "active" },
      });
    });
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}

export const accountService = new AccountService();
