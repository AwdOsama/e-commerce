import type { CartResponse } from "../interfaces/cart.interface";
import {
  addProductToCartAction,
  clearCartAction,
  removeCartItemAction,
  updateCartProductQuantityAction,
} from "../actions/cart.actions";

export const cartQueryKey = ["cart"] as const;

export async function getCart(): Promise<CartResponse> {
  const response = await fetch("/api/cart", { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Unable to load your cart.");
  }
  const cart = result as CartResponse;
  if (!Array.isArray(cart.payload?.data?.products)) {
    throw new Error("The cart response has an unexpected format.");
  }
  return cart;
}

export const addProductToCart = addProductToCartAction;

export const updateCartProductQuantity = updateCartProductQuantityAction;

export function removeCartItem(productId: string) {
  return removeCartItemAction(productId);
}

export function clearCart() {
  return clearCartAction();
}
