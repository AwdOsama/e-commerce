import type { OrderProduct, OrdersResponse, UserOrder } from "../interfaces/order.interface";

export const ordersQueryKey = ["orders"] as const;

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function unwrapArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  const data = record(value);
  if (!data) return undefined;
  for (const key of ["data", "orders", "payload"]) {
    const found = unwrapArray(data[key]);
    if (found) return found;
  }
  return undefined;
}

function normalizeProduct(value: unknown): OrderProduct | undefined {
  const line = record(value);
  if (!line) return undefined;
  const product = record(line.product) ?? line;
  const title = firstString(product.title, product.name);
  if (!title) return undefined;
  return {
    _id: firstString(product._id, line._id),
    title,
    imageCover: firstString(product.imageCover, product.image),
    brand: firstString(record(product.brand)?.name),
    price: numberValue(line.price ?? product.priceAfterDiscount ?? product.price),
    count: Math.max(1, numberValue(line.count ?? line.quantity, 1)),
  };
}

function normalizeOrder(value: unknown): UserOrder | undefined {
  const source = record(value);
  if (!source) return undefined;
  const id = firstString(source._id, source.id);
  if (!id) return undefined;
  const rawAddress = record(source.shippingAddress) ?? record(source.address);
  const rawProducts = source.cartItems ?? source.products ?? source.orderItems;
  const products = (Array.isArray(rawProducts) ? rawProducts : []).map(normalizeProduct).filter((item): item is OrderProduct => Boolean(item));
  return {
    _id: id,
    createdAt: firstString(source.createdAt, source.date),
    totalOrderPrice: numberValue(source.totalOrderPrice ?? source.totalPrice ?? source.total),
    paymentMethodType: firstString(source.paymentMethodType, source.paymentMethod),
    isPaid: typeof source.isPaid === "boolean" ? source.isPaid : undefined,
    isDelivered: typeof source.isDelivered === "boolean" ? source.isDelivered : undefined,
    shippingAddress: rawAddress ? {
      details: firstString(rawAddress.details, rawAddress.street),
      city: firstString(rawAddress.city),
      phone: firstString(rawAddress.phone),
    } : undefined,
    products,
  };
}

export function normalizeOrders(response: OrdersResponse): UserOrder[] {
  const rows = unwrapArray(response.payload);
  if (!rows) throw new Error("The orders response has an unexpected format.");
  return rows.map(normalizeOrder).filter((order): order is UserOrder => Boolean(order));
}

export async function getUserOrders(): Promise<UserOrder[]> {
  const response = await fetch("/api/orders", { cache: "no-store" });
  const result = await response.json().catch(() => null) as { payload?: unknown; message?: string } | null;
  if (!response.ok) throw new Error(result?.message || "Unable to load your orders.");
  return normalizeOrders({ payload: result?.payload });
}
