import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { productService } from "src/lib/services/product";

const listQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = listQuerySchema.safeParse({
    status: searchParams.get("status") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid product list query" },
      {
        status: 400,
        headers: { "cache-control": "private, no-store" },
      },
    );
  }
  const result = await productService.list(parsed.data);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: { "cache-control": "private, no-store" },
    });
  }
  return NextResponse.json(result.data, {
    headers: { "cache-control": "private, no-store" },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await productService.create(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, { status: 201 });
}
