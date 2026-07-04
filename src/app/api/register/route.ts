import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "src/lib/prisma";
import { userRegisterSchema } from "src/lib/validations";
import { rateLimit, getRateLimitHeaders } from "src/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = rateLimit(`register:${ip}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 registrations per 15 minutes
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: "Too many registration attempts. Please try again later.",
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await req.json();

    const result = userRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          status: "error",
          message: "User with this email already exists",
        },
        {
          status: 409,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
        role: "user",
        Account: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        user,
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
