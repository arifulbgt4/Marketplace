"use server";
import { cache } from "react";
import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";
import { AuthorizationError } from "src/lib/errors";

export const getUser = cache(async () => {
  const session = await getAuthSession();

  if (session) {
    const user = await prisma.user.findFirst({
      where: { id: session.userId },
      include: {
        Account: true,
        _count: {
          select: {
            listings: true,
            orders: true,
            reviewsWritten: true,
          },
        },
      },
    });

    if (user) {
      return user;
    }
  }
});

export const updateUser = async ({
  id,
  ...payload
}: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
}) => {
  const session = await getAuthSession();
  if (!session || session.userId !== id) throw new AuthorizationError();
  const res = await prisma.user.update({
    where: { id },
    data: { name: payload.name, phone: payload.phone, image: payload.image },
  });

  return res;
};
