import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import type { ReviewFormValues } from "../schema/review.schema";

type ReviewMethod = "POST" | "PUT" | "DELETE";

function apiBase() {
  const base = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!base) throw new Error("Reviews service is not configured.");
  return base;
}

export async function requestProductReviews(productId: string) {
  const response = await fetch(`${apiBase()}/products/${encodeURIComponent(productId)}/reviews`, { cache: "no-store" });
  const data: unknown = await response.json().catch(() => null);
  return { status: response.status, data };
}

export async function forwardProductReviews(request: NextRequest, productId: string, method: ReviewMethod, body?: ReviewFormValues) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Please sign in to write a review." }, { status: 401 });
  try {
    const response = await fetch(`${apiBase()}/products/${encodeURIComponent(productId)}/reviews`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    if (response.status === 204) return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    const data: unknown = await response.json().catch(() => null);
    return NextResponse.json({ payload: data }, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the reviews service." }, { status: 502 });
  }
}

export async function forwardReviewMutation(request: NextRequest, reviewId: string, method: "PUT" | "DELETE", body?: ReviewFormValues) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Please sign in to manage your review." }, { status: 401 });
  try {
    const response = await fetch(`${apiBase()}/reviews/${encodeURIComponent(reviewId)}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    if (response.status === 204) return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    const data: unknown = await response.json().catch(() => null);
    return NextResponse.json({ payload: data }, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the reviews service." }, { status: 502 });
  }
}
