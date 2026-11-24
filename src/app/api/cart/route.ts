import { NextResponse, type NextRequest } from "next/server";
import { forwardCartRequest } from "@/src/features/cart/apis/cart.server";

export async function GET(request: NextRequest) {
  return forwardCartRequest(request, { method: "GET" });
}

export async function POST(request: NextRequest) {
  let productId: unknown;
  try {
    ({ productId } = await request.json());
  } catch {
    return NextResponse.json({ message: "A productId is required" }, { status: 400 });
  }

  if (typeof productId !== "string" || !productId.trim()) {
    return NextResponse.json({ message: "A productId is required" }, { status: 400 });
  }

  return forwardCartRequest(request, {
    method: "POST",
    body: { productId },
  });
}

export async function DELETE(request: NextRequest) {
  return forwardCartRequest(request, { method: "DELETE" });
}
