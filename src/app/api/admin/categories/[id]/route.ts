import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { categoryService } = await import("src/lib/services/category");
  const { id } = await context.params;
  const result = await categoryService.getById(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { categoryService } = await import("src/lib/services/category");
  const { id } = await context.params;
  const body = await request.json();
  const result = await categoryService.update(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { categoryService } = await import("src/lib/services/category");
  const { id } = await context.params;
  const result = await categoryService.delete(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}
