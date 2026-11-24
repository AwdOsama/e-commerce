import { NextResponse, type NextRequest } from "next/server";
import { forwardWishlistRequest } from "@/src/features/wishlist/apis/wishlist.server";

type WishlistProductRouteContext = { params: Promise<{ productId: string }> };

export async function DELETE(request: NextRequest, context: WishlistProductRouteContext) {
  const { productId } = await context.params;
  if (!productId.trim()) return NextResponse.json({ message: "A productId is required." }, { status: 400 });
  return forwardWishlistRequest(request, { method: "DELETE", path: `/${encodeURIComponent(productId)}` });
}
