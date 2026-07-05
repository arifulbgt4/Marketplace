import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import { addressService } from "src/lib/services/address";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ addresses: [] });
    }
    const addresses = await addressService.list(session.user.id);
    return NextResponse.json({ addresses });
  } catch {
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const address = await addressService.create(session.user.id, body);
    return NextResponse.json(address, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create address";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
