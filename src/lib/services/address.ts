import { prisma } from "src/lib/prisma";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "src/lib/errors";
import { z } from "zod";

const addressInputSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  label: z.string().trim().min(1).max(80),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(24),
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/)
    .transform((value) => value.toUpperCase()),
  phone: z.string().trim().max(32).optional(),
  isDefault: z.boolean().optional(),
});

export type AddressType = "shipping" | "billing";

export type AddressData = {
  id: string;
  userId: string;
  type: AddressType;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class AddressService {
  async list(userId: string): Promise<AddressData[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return addresses.map(this.mapToData);
  }

  async getById(addressId: string, userId: string): Promise<AddressData> {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address) throw new NotFoundError("Address", addressId);
    if (address.userId !== userId)
      throw new AuthorizationError("Address does not belong to user");
    return this.mapToData(address);
  }

  async create(
    userId: string,
    data: {
      type: AddressType;
      label: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
      isDefault?: boolean;
    },
  ): Promise<AddressData> {
    const parsed = addressInputSchema.safeParse(data);
    if (!parsed.success)
      throw new ValidationError("Address fields are invalid");
    const input = parsed.data;

    const makeDefault = input.isDefault ?? false;
    const address = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId, type: input.type, isDefault: true },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: {
          userId,
          type: input.type,
          label: input.label,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country,
          phone: input.phone || null,
          isDefault: makeDefault,
        },
      });
    });

    return this.mapToData(address);
  }

  async update(
    addressId: string,
    userId: string,
    data: {
      type?: AddressType;
      label?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
      isDefault?: boolean;
    },
  ): Promise<AddressData> {
    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!existing) throw new NotFoundError("Address", addressId);
    if (existing.userId !== userId)
      throw new AuthorizationError("Address does not belong to user");

    const parsed = addressInputSchema.partial().safeParse(data);
    if (!parsed.success)
      throw new ValidationError("Address fields are invalid");
    data = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.label !== undefined) updateData.label = data.label;
    if (data.line1 !== undefined) updateData.line1 = data.line1;
    if (data.line2 !== undefined) updateData.line2 = data.line2;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    const updated = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: {
            userId,
            type: data.type ?? existing.type,
            isDefault: true,
            id: { not: addressId },
          },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id: addressId },
        data: updateData,
      });
    });

    return this.mapToData(updated);
  }

  async delete(addressId: string, userId: string): Promise<void> {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address) throw new NotFoundError("Address", addressId);
    if (address.userId !== userId)
      throw new AuthorizationError("Address does not belong to user");
    await prisma.address.delete({ where: { id: addressId } });
  }

  async getDefault(
    userId: string,
    type: AddressType,
  ): Promise<AddressData | null> {
    const address = await prisma.address.findFirst({
      where: { userId, type, isDefault: true },
    });
    return address ? this.mapToData(address) : null;
  }

  private mapToData(a: Record<string, unknown>): AddressData {
    return {
      id: a.id as string,
      userId: a.userId as string,
      type: a.type as AddressType,
      label: a.label as string,
      line1: a.line1 as string,
      line2: (a.line2 as string) ?? null,
      city: a.city as string,
      state: a.state as string,
      postalCode: a.postalCode as string,
      country: a.country as string,
      phone: (a.phone as string) ?? null,
      isDefault: a.isDefault as boolean,
      createdAt: a.createdAt as Date,
      updatedAt: a.updatedAt as Date,
    };
  }
}

export const addressService = new AddressService();
