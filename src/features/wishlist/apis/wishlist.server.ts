import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type WishlistRequest = {
  method: "GET" | "POST" | "DELETE";
  path?: string;
  body?: { productId: string };
};

export async function requestWishlist(token: string, { method, path = "", body }: WishlistRequest) {
  const apiBase = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiBase) throw new Error("Wishlist service is not configured.");

  const response = await fetch(`${apiBase}/wishlist${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });
  if (response.status === 204) return { status: 204, data: null };
  const data: unknown = await response.json().catch(() => null);
  return { status: response.status, data };
}

export async function forwardWishlistRequest(request: NextRequest, options: WishlistRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const result = await requestWishlist(token, options);
    if (result.status === 204) return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ payload: result.data }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to the wishlist service.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
