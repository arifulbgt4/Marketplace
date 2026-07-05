import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { productService } = await import("src/lib/services/product");
  const { id } = await context.params;
  const result = await productService.getById(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { productService } = await import("src/lib/services/product");
  const { id } = await context.params;
  const body = await request.json();
  const result = await productService.update(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { productService } = await import("src/lib/services/product");
  const { id } = await context.params;
  const result = await productService.archive(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}
