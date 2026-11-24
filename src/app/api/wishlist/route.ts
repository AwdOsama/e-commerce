import { NextResponse, type NextRequest } from "next/server";
import { forwardWishlistRequest } from "@/src/features/wishlist/apis/wishlist.server";

export async function GET(request: NextRequest) {
  return forwardWishlistRequest(request, { method: "GET" });
}

export async function POST(request: NextRequest) {
  let productId: unknown;
  try { ({ productId } = await request.json()); } catch { return NextResponse.json({ message: "A productId is required." }, { status: 400 }); }
  if (typeof productId !== "string" || !productId.trim()) return NextResponse.json({ message: "A productId is required." }, { status: 400 });
  return forwardWishlistRequest(request, { method: "POST", body: { productId: productId.trim() } });
}
