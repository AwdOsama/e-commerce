import { NextResponse, type NextRequest } from "next/server";
import { forwardOrderRequest } from "@/src/features/checkout/apis/checkout.server";
import { cashOrderRequestSchema } from "@/src/features/checkout/schema/checkout.schema";

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid order details." }, { status: 400 }); }
  const parsed = cashOrderRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid order details." }, { status: 400 });
  return forwardOrderRequest(request, { kind: "cash", ...parsed.data });
}
