import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "src/lib/prisma";
import type { Role } from "src/lib/authz";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      status: string;
      sessionVersion: number;
    };
  }
  interface User {
    role: Role;
    status: string;
    sessionVersion: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: string;
    sessionVersion: number;
    invalidated?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        if (user.status !== "active") {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role as Role) || "user",
          status: user.status,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          status: token.status,
          sessionVersion: token.sessionVersion,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          status: user.status,
          sessionVersion: user.sessionVersion,
          invalidated: false,
        };
      }

      if (!token.id) return token;
      const currentUser = await prisma.user.findUnique({
        where: { id: token.id },
        select: { role: true, status: true, sessionVersion: true },
      });
      if (
        !currentUser ||
        currentUser.status !== "active" ||
        currentUser.sessionVersion !== token.sessionVersion
      ) {
        return {
          ...token,
          invalidated: true,
          status: currentUser?.status ?? "suspended",
        };
      }
      return {
        ...token,
        role: currentUser.role as Role,
        status: currentUser.status,
        invalidated: false,
      };
    },
  },
};
