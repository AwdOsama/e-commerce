import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import type { CheckoutValues } from "../schema/checkout.schema";

type CheckoutRequest = {
  method: "POST";
  kind: "cash" | "online";
  cartId: string;
  shippingAddress?: CheckoutValues;
  url?: string;
};

export async function requestOrder(token: string, input: CheckoutRequest) {
  const apiV1 = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiV1) throw new Error("Checkout service is not configured.");
  const apiV2 = apiV1.replace(/\/api\/v1$/, "/api/v2");
  const endpoint = input.kind === "cash"
    ? `${apiV2}/orders/${encodeURIComponent(input.cartId)}`
    : `${apiV1}/orders/checkout-session/${encodeURIComponent(input.cartId)}?url=${encodeURIComponent(input.url ?? "")}`;
  try {
    const response = await fetch(endpoint, {
      method: input.method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(input.shippingAddress ? { body: JSON.stringify({ shippingAddress: input.shippingAddress }) } : {}),
      cache: "no-store",
    });
    const data: unknown = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch {
    throw new Error("Unable to connect to the checkout service.");
  }
}

export async function forwardOrderRequest(request: NextRequest, input: Omit<CheckoutRequest, "method">) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const result = await requestOrder(token, { ...input, method: "POST" });
    return NextResponse.json({ payload: result.data }, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to place your order.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
