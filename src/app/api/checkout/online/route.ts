import { NextResponse, type NextRequest } from "next/server";
import { forwardOrderRequest } from "@/src/features/checkout/apis/checkout.server";
import { onlineCheckoutRequestSchema } from "@/src/features/checkout/schema/checkout.schema";

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid checkout details." }, { status: 400 }); }
  const parsed = onlineCheckoutRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid checkout details." }, { status: 400 });
  let checkoutUrl: URL;
  try { checkoutUrl = new URL(parsed.data.url); } catch { return NextResponse.json({ message: "Invalid return URL." }, { status: 400 }); }
  if (checkoutUrl.origin !== request.nextUrl.origin) return NextResponse.json({ message: "Return URL must belong to this store." }, { status: 400 });
  return forwardOrderRequest(request, { kind: "online", cartId: parsed.data.cartId, url: checkoutUrl.toString(), shippingAddress: parsed.data.shippingAddress });
}
