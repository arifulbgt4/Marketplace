import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "src/lib/prisma";
import { userRegisterSchema } from "src/lib/validations";
import { rateLimit, getRateLimitHeaders } from "src/lib/rate-limit";
import { accountService } from "src/lib/services/account";
import { accountNotificationService } from "src/lib/services/account-notification";

export async function POST(req: Request) {
  const requestId = randomUUID();
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitResult = rateLimit(`register:${ip}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 registrations per 15 minutes
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          status: "error",
          code: "RATE_LIMITED",
          message: "Too many registration attempts. Please try again later.",
          requestId,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      );
    }

    const body = await req.json();

    const result = userRegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
          requestId,
        },
        {
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult),
        },
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
          code: "CONFLICT",
          message: "User with this email already exists",
          requestId,
        },
        {
          status: 409,
          headers: getRateLimitHeaders(rateLimitResult),
        },
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
    const verificationToken =
      await accountService.generateEmailVerificationToken(user.id);
    let verificationPreviewUrl: string | undefined;
    let emailDelivery = "sent";
    try {
      const delivery = await accountNotificationService.sendVerification(
        user.email,
        verificationToken,
      );
      verificationPreviewUrl = delivery.previewUrl;
      if (!delivery.delivered) emailDelivery = "preview";
    } catch (error: unknown) {
      emailDelivery = "unavailable";
      console.error("Registration verification delivery failed", {
        requestId,
        error: error instanceof Error ? error.message : "unknown",
      });
    }

    return NextResponse.json(
      {
        status: "success",
        requestId,
        user,
        verificationRequired: true,
        emailDelivery,
        verificationPreviewUrl,
      },
      {
        status: 201,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        requestId,
      },
      { status: 500 },
    );
  }
}
