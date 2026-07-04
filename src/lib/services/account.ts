import { randomBytes, createHash } from "crypto";
import { prisma } from "src/lib/prisma";
import { NotFoundError, ValidationError, AuthenticationError } from "src/lib/errors";

const TOKEN_EXPIRY_HOURS = 24;
const TOKEN_BYTES = 32;

export class AccountService {
  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError("User with this email");

    const raw = randomBytes(TOKEN_BYTES).toString("hex");
    const hashed = this.hashToken(raw);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ResetToken" (id, "userId", token, "expiresAt", used)
       VALUES (gen_random_uuid(), $1, $2, $3, false)
       ON CONFLICT ("userId") DO UPDATE SET token = $2, "expiresAt" = $3, used = false`,
      user.id,
      hashed,
      expiresAt
    );

    return raw;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashed = this.hashToken(token);
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "userId", "expiresAt", used FROM "ResetToken" WHERE token = $1`,
      hashed
    );

    const record = rows[0];
    if (!record) throw new ValidationError("Invalid or expired reset token");
    if (record.used) throw new ValidationError("Reset token has already been used");
    if (new Date(record.expiresAt as Date) < new Date()) {
      throw new ValidationError("Reset token has expired");
    }

    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.$executeRawUnsafe(`UPDATE "ResetToken" SET used = true WHERE id = $1`, record.id as string),
      prisma.$executeRawUnsafe(`UPDATE "User" SET password = $1 WHERE id = $2`, hashedPassword, record.userId as string),
    ]);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User", userId);

    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AuthenticationError("Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }

  async generateEmailVerificationToken(userId: string): Promise<string> {
    const raw = randomBytes(TOKEN_BYTES).toString("hex");
    const hashed = this.hashToken(raw);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "VerificationToken" (id, "userId", token, "expiresAt", used)
       VALUES (gen_random_uuid(), $1, $2, $3, false)
       ON CONFLICT ("userId") DO UPDATE SET token = $2, "expiresAt" = $3, used = false`,
      userId,
      hashed,
      expiresAt
    );

    return raw;
  }

  async verifyEmail(token: string): Promise<void> {
    const hashed = this.hashToken(token);
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "userId", "expiresAt", used FROM "VerificationToken" WHERE token = $1`,
      hashed
    );

    const record = rows[0];
    if (!record) throw new ValidationError("Invalid or expired verification token");
    if (record.used) throw new ValidationError("Verification token has already been used");
    if (new Date(record.expiresAt as Date) < new Date()) {
      throw new ValidationError("Verification token has expired");
    }

    await prisma.$transaction([
      prisma.$executeRawUnsafe(
        `UPDATE "VerificationToken" SET used = true WHERE id = $1`,
        record.id as string
      ),
      prisma.$executeRawUnsafe(
        `UPDATE "User" SET status = 'active' WHERE id = $1`,
        record.userId as string
      ),
    ]);
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}

export const accountService = new AccountService();
