import type { WishlistResponse } from "../interfaces/wishlist.interface";
import { addToWishlistAction, removeFromWishlistAction } from "../actions/wishlist.actions";

export const wishlistQueryKey = ["wishlist"] as const;

export async function getWishlist(): Promise<WishlistResponse> {
  const response = await fetch("/api/wishlist", { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to load your wishlist.");
  const wishlist = result as WishlistResponse;
  if (!Array.isArray(wishlist.payload?.data)) throw new Error("The wishlist response has an unexpected format.");
  return wishlist;
}

export const addToWishlist = addToWishlistAction;
export const removeFromWishlist = removeFromWishlistAction;
