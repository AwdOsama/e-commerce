import { NextResponse, type NextRequest } from "next/server";
import { forwardAddressRequest } from "@/src/features/addresses/apis/address.server";
import { addressSchema } from "@/src/features/addresses/schema/address.schema";

export async function GET(request: NextRequest) {
  return forwardAddressRequest(request, { method: "GET" });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid address details." }, { status: 400 }); }
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid address details." }, { status: 400 });
  return forwardAddressRequest(request, { method: "POST", body: parsed.data });
}
