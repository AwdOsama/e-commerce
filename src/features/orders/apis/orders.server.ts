import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

function findUserId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (typeof record._id === "string" && /^[a-f\d]{24}$/i.test(record._id)) return record._id;
  for (const key of ["user", "data", "profile"]) {
    const found = findUserId(record[key]);
    if (found) return found;
  }
  return undefined;
}

export async function forwardUserOrders(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Please sign in to view your orders." }, { status: 401 });
  const apiBase = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiBase) return NextResponse.json({ message: "Order service is not configured." }, { status: 500 });

  try {
    let userId = typeof session.sub === "string" && /^[a-f\d]{24}$/i.test(session.sub) ? session.sub : undefined;
    if (!userId) {
      const profileResponse = await fetch(`${apiBase}/users/getMe`, {
        headers: { Authorization: `Bearer ${token}`, token },
        cache: "no-store",
      });
      const profile = await profileResponse.json().catch(() => null);
      if (!profileResponse.ok) return NextResponse.json({ message: "Unable to identify your account." }, { status: profileResponse.status });
      userId = findUserId(profile);
    }
    if (!userId) return NextResponse.json({ message: "Your account id was not returned by the profile service." }, { status: 502 });

    const response = await fetch(`${apiBase}/orders/user/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${token}`, token },
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);
    return NextResponse.json({ payload }, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the order service." }, { status: 502 });
  }
}
