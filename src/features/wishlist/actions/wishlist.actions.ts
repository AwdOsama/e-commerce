"use server";

import { getServerSession } from "next-auth/next";
import { authOP } from "@/Next-auth/next-auth";
import type { WishlistResponse } from "../interfaces/wishlist.interface";
import { requestWishlist } from "../apis/wishlist.server";

async function mutateWishlist(method: "POST" | "DELETE", productId: string) {
  if (!productId.trim()) throw new Error("A productId is required.");
  const session = await getServerSession(authOP);
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Unauthorized");

  const result = await requestWishlist(token, {
    method,
    ...(method === "DELETE" ? { path: `/${encodeURIComponent(productId)}` } : {}),
    ...(method === "POST" ? { body: { productId } } : {}),
  });
  if (result.status < 200 || result.status >= 300) {
    const payload = result.data as { message?: string; errors?: { msg?: string }[] } | null;
    throw new Error(payload?.message || payload?.errors?.[0]?.msg || "Unable to update your wishlist.");
  }
  return result.status === 204 ? null : { payload: result.data } as WishlistResponse;
}

export async function addToWishlistAction(productId: string) {
  return mutateWishlist("POST", productId);
}

export async function removeFromWishlistAction(productId: string) {
  return mutateWishlist("DELETE", productId);
}
