import { prisma } from "src/lib/prisma";
import { NotFoundError } from "src/lib/errors";
import type { UserUpdateInput } from "src/lib/validations";
import type { UserRole } from "@prisma/client";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  image: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class UserService {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User", userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "active",
      image: user.image ?? null,
      phone: user.phone ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "active",
      image: user.image ?? null,
      phone: user.phone ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(
    userId: string,
    data: UserUpdateInput,
    options?: { updaterId?: string }
  ): Promise<UserProfile> {
    const actorId = options?.updaterId ?? userId;
    if (userId !== actorId) {
      throw new Error("A user can only update their own profile");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User", userId);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.image !== undefined) updateData.image = data.image;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: "active",
      image: updated.image ?? null,
      phone: updated.phone ?? null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async findByRole(role: string): Promise<UserProfile[]> {
    const users = await prisma.user.findMany({
      where: { role: role as UserRole },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: "active",
      image: u.image ?? null,
      phone: u.phone ?? null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }
}

export const userService = new UserService();
