import "server-only";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

type ProfileRequest = { method: "GET" | "PUT"; path: string; body?: Record<string, string> };

export async function forwardProfileRequest(request: NextRequest, { method, path, body }: ProfileRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Please sign in to view your settings." }, { status: 401 });
  const base = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!base) return NextResponse.json({ message: "Profile service is not configured." }, { status: 500 });

  try {
    const response = await fetch(`${base}/users/${path}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);
    return NextResponse.json({ payload }, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the profile service." }, { status: 502 });
  }
}
