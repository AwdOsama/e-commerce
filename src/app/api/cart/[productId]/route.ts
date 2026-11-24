import { NextResponse, type NextRequest } from "next/server";
import { forwardCartRequest } from "@/src/features/cart/apis/cart.server";

type CartProductRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PUT(request: NextRequest, context: CartProductRouteContext) {
  let count: unknown;
  try {
    ({ count } = await request.json());
  } catch {
    return NextResponse.json({ message: "A valid count is required" }, { status: 400 });
  }

  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    return NextResponse.json({ message: "Count must be a positive integer" }, { status: 400 });
  }

  const { productId } = await context.params;
  return forwardCartRequest(request, {
    method: "PUT",
    path: `/${encodeURIComponent(productId)}`,
    body: { count },
  });
}

export async function DELETE(request: NextRequest, context: CartProductRouteContext) {
  const { productId } = await context.params;
  return forwardCartRequest(request, {
    method: "DELETE",
    path: `/${encodeURIComponent(productId)}`,
  });
}
