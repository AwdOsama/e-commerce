"use server";

import { getServerSession } from "next-auth/next";
import { authOP } from "@/Next-auth/next-auth";
import { requestCart } from "../apis/cart.server";
import type { CartResponse } from "../interfaces/cart.interface";

async function mutateCart(method: "POST" | "PUT" | "DELETE", path = "", body?: Record<string, string | number>) {
  const session = await getServerSession(authOP);
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Unauthorized");

  const result = await requestCart(token, { method, path, body });
  if (result.status < 200 || result.status >= 300) {
    const payload = result.data as { message?: string; errors?: { msg?: string }[] } | null;
    throw new Error(payload?.message || payload?.errors?.[0]?.msg || "Unable to update your cart.");
  }
  return result.status === 204 ? null : { payload: result.data } as CartResponse;
}

export async function addProductToCartAction(productId: string) {
  if (typeof productId !== "string" || !productId.trim()) throw new Error("A productId is required");
  return mutateCart("POST", "", { productId });
}

export async function updateCartProductQuantityAction(productId: string, count: number) {
  if (!productId || !Number.isInteger(count) || count < 1) throw new Error("Count must be a positive integer");
  return mutateCart("PUT", `/${encodeURIComponent(productId)}`, { count });
}

export async function removeCartItemAction(productId: string) {
  if (!productId) throw new Error("A productId is required");
  return mutateCart("DELETE", `/${encodeURIComponent(productId)}`);
}

export async function clearCartAction() {
  return mutateCart("DELETE");
}
