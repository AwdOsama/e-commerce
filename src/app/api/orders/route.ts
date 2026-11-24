import type { NextRequest } from "next/server";
import { forwardUserOrders } from "@/src/features/orders/apis/orders.server";

export async function GET(request: NextRequest) {
  return forwardUserOrders(request);
}
