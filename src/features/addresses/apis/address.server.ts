import "server-only";

import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import type { AddressFormValues } from "../schema/address.schema";

export type AddressRequest = {
  method: "GET" | "POST" | "DELETE";
  path?: string;
  body?: AddressFormValues;
};

export async function requestAddress(token: string, { method, path = "", body }: AddressRequest) {
  const apiBase = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiBase) throw new Error("Address service is not configured.");
  try {
    const response = await fetch(`${apiBase}/addresses${path}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, token },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    if (response.status === 204) return { status: 204, data: null };
    const data: unknown = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch {
    throw new Error("Unable to connect to the address service.");
  }
}

export async function forwardAddressRequest(request: NextRequest, options: AddressRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = session?.accessToken;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const result = await requestAddress(token, options);
    if (result.status === 204) return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    return NextResponse.json({ payload: result.data }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load your addresses.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
