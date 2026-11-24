import { NextResponse, type NextRequest } from "next/server";
import { forwardAddressRequest } from "@/src/features/addresses/apis/address.server";

type AddressRouteContext = { params: Promise<{ addressId: string }> };

export async function GET(request: NextRequest, context: AddressRouteContext) {
  const { addressId } = await context.params;
  if (!addressId.trim()) return NextResponse.json({ message: "An address ID is required." }, { status: 400 });
  return forwardAddressRequest(request, { method: "GET", path: `/${encodeURIComponent(addressId)}` });
}

export async function DELETE(request: NextRequest, context: AddressRouteContext) {
  const { addressId } = await context.params;
  if (!addressId.trim()) return NextResponse.json({ message: "An address ID is required." }, { status: 400 });
  return forwardAddressRequest(request, { method: "DELETE", path: `/${encodeURIComponent(addressId)}` });
}
