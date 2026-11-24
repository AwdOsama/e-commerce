import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type CartRequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path?: string;
  body?: Record<string, string | number>;
};

export async function requestCart(token: string, { method, path = "", body }: CartRequestOptions) {
  const apiBase = process.env.PUBLIC_API?.replace(/\/api\/v1\/?$/, "/api/v2");
  if (!apiBase) throw new Error("Cart service is not configured");

  try {
    const response = await fetch(`${apiBase}/cart${path}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    if (response.status === 204) return { status: 204 as const, data: null };
    const payload: unknown = await response.json().catch(() => null);
    return { status: response.status, data: payload };
  } catch {
    throw new Error("Unable to connect to the cart service");
  }
}

export async function forwardCartRequest(
  request: NextRequest,
  { method, path = "", body }: CartRequestOptions,
) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const token = session?.accessToken;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await requestCart(token, { method, path, body });
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json({ payload: response.data }, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update cart";
    return NextResponse.json({ message }, { status: 502 });
  }
}
