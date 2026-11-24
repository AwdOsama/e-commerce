"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  LockKeyhole,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import type { CartLine, CartResponse } from "../interfaces/cart.interface";
import {
  useCartQuery,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartProductQuantity,
} from "../hooks/useCart";
import { cartQueryKey } from "../apis/cart.api";
import { toast } from "react-toastify";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  color: string;
  swatch: string;
  tone: string;
  glyph: string;
  image?: string;
};

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCart(response: CartResponse): CartItem[] {
  const lines: CartLine[] = response.payload.data.products;
  return lines.flatMap((line, index) => {
    const product = line.product;
    const productId = product._id;
    if (!productId) return [];

    const color = product.availableColors?.[0] ?? "Default";
    const priceCandidates = [product.priceAfterDiscount, product.price, line.price];
    const price = priceCandidates
      .map((candidate) => candidate == null ? Number.NaN : finiteNumber(candidate, Number.NaN))
      .find((candidate) => Number.isFinite(candidate)) ?? 0;

    return [{
      id: line._id || productId || String(index),
      productId,
      name: product.title,
      brand: product.brand?.name ?? product.category?.name ?? "Fresh Cart",
      category: product.category?.name ?? "Products",
      price,
      quantity: Math.max(1, finiteNumber(line.count, 1)),
      color,
      swatch: "#c8bda8",
      tone: "#f0ece4",
      glyph: "✦",
      image: product.imageCover,
    }];
  });
}

const money = (amount: number) =>
  `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(finiteNumber(amount))} EGP`;

function ProductArt({ item }: { item: CartItem }) {
  return (
    <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5f6f4] sm:size-[88px]" aria-hidden="true">
      {item.image ? (
        <img src={item.image} alt="" className="size-full object-contain mix-blend-multiply" />
      ) : (
        <div className="relative flex size-[58px] items-center justify-center sm:size-[68px]">
          <span className="absolute inset-x-2 top-1 h-[14px] rounded-t-full opacity-70" style={{ backgroundColor: item.swatch }} />
          <span className="relative mt-1 flex h-[49px] w-[39px] items-center justify-center rounded-[42%_42%_16%_16%] text-lg shadow-sm sm:h-[56px] sm:w-[45px]" style={{ background: `linear-gradient(110deg, ${item.swatch}, ${item.swatch} 48%, color-mix(in srgb, ${item.swatch}, white 20%))`, color: "#ffffff" }}>
            {item.glyph}
          </span>
        </div>
      )}
    </div>
  );
}

export default function CartCom() {
  const queryClient = useQueryClient();
  const cartQuery = useCartQuery();
  const updateQuantityMutation = useUpdateCartProductQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const serverItems = useMemo(
    () => cartQuery.data ? normalizeCart(cartQuery.data) : [],
    [cartQuery.data],
  );
  const items = serverItems;

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  const updateCartCache = (update: (current: CartItem[]) => CartItem[]) => {
    queryClient.setQueryData<CartResponse>(cartQueryKey, (current) => {
      if (!current) return current;

      const updatedItems = update(normalizeCart(current));
      const itemByLineId = new Map(updatedItems.map((item) => [item.id, item]));
      const products = current.payload.data.products.flatMap((line) => {
        const updatedItem = itemByLineId.get(line._id);
        return updatedItem ? [{ ...line, count: updatedItem.quantity }] : [];
      });
      const numOfCartItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalCartPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        ...current,
        payload: {
          ...current.payload,
          numOfCartItems,
          data: { ...current.payload.data, products, totalCartPrice },
        },
      };
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;

    const nextQuantity = item.quantity + amount;
    if (nextQuantity < 1) {
      updateCartCache((current) => current.filter((cartItem) => cartItem.id !== id));
      removeItemMutation.mutate(item.productId, {
        onError: (error) => toast.error(error.message || "Unable to remove this item."),
      });
      return;
    }

    updateCartCache((current) =>
      current
        .map((cartItem) => cartItem.id === id ? { ...cartItem, quantity: nextQuantity } : cartItem),
    );
    updateQuantityMutation.mutate({ productId: item.productId, count: nextQuantity }, {
      onError: (error) => toast.error(error.message || "Unable to update the quantity."),
    });
  };

  const removeItem = (id: string) => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;
    updateCartCache((current) => current.filter((cartItem) => cartItem.id !== id));
    removeItemMutation.mutate(item.productId, {
      onError: (error) => toast.error(error.message || "Unable to remove this item."),
    });
  };

  const handleClearCart = () => {
    updateCartCache(() => []);
    clearCartMutation.mutate(undefined, {
      onError: (error) => toast.error(error.message || "Unable to clear your cart."),
    });
  };

  return (
    <main className="bg-[#f7f8f7] pb-10 pt-1 text-[#18231e] lg:pt-2">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#e8f6ed] text-[#159447]">
            <ShoppingCart size={19} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-[21px] font-bold leading-6 tracking-[-0.03em] sm:text-2xl">Shopping Cart</h1>
            <p className="mt-1 text-[11px] text-[#79827d]">You have <span className="font-semibold text-[#159447]">{itemCount} items</span> in your cart</p>
          </div>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.95fr)_minmax(285px,0.86fr)] lg:gap-5">
          <section aria-label="Cart items" className="space-y-3">
            {cartQuery.isPending ? (
              <div role="status" className="rounded-xl border border-[#e8ece9] bg-white px-5 py-12 text-center text-sm text-[#78827d]">Loading your cart…</div>
            ) : cartQuery.isError ? (
              <div role="alert" className="rounded-xl border border-[#f2d6d6] bg-white px-5 py-10 text-center">
                <h2 className="font-semibold">We couldn’t load your cart</h2>
                <p className="mt-1 text-sm text-[#78827d]">Please refresh the page and try again.</p>
              </div>
            ) : items.length ? items.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#e8ece9] bg-white p-3 shadow-[0_2px_10px_rgba(25,52,37,0.025)] sm:p-3.5">
                <div className="flex gap-3 sm:gap-4">
                  <ProductArt item={item} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-[12px] font-semibold leading-[1.45] text-[#202923] sm:text-[13px]">{item.name}</h2>
                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] text-[#8a948e]">
                          <span className="rounded-full bg-[#edf8f0] px-1.5 py-0.5 font-semibold text-[#168d43]">{item.category}</span>
                          <span>•</span><span>{item.brand}</span>
                        </p>
                        <p className="mt-1.5 text-[10px] font-semibold text-[#18984a]">{money(item.price)} <span className="font-normal text-[#8a948e]">per unit</span></p>
                      </div>
                      <button type="button" disabled={removeItemMutation.isPending || clearCartMutation.isPending} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="flex size-[27px] shrink-0 items-center justify-center rounded-md bg-[#fff0f0] text-[#ed7777] transition hover:bg-[#ffe2e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50">
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-end justify-between gap-2">
                      <div className="flex items-center gap-1.5" aria-label={`Color: ${item.color}`}>
                        <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: item.swatch }} />
                        <span className="text-[9px] text-[#77817b]">{item.color}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-[27px] items-center rounded-md border border-[#e8ece9] bg-[#fbfcfb]">
                          <button type="button" disabled={updateQuantityMutation.isPending || removeItemMutation.isPending || clearCartMutation.isPending} aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, -1)} className="flex size-7 items-center justify-center text-[#78827d] hover:text-[#159447] disabled:opacity-50"><Minus size={12} /></button>
                          <span aria-live="polite" className="min-w-5 text-center text-[10px] font-semibold">{item.quantity}</span>
                          <button type="button" disabled={updateQuantityMutation.isPending || clearCartMutation.isPending} aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, 1)} className="flex size-7 items-center justify-center rounded-r-md bg-[#159b4b] text-white hover:bg-[#11833f] disabled:opacity-50"><Plus size={12} /></button>
                        </div>
                        <div className="min-w-[47px] text-right">
                          <span className="block text-[8px] text-[#96a09a]">Total</span>
                          <span className="text-[11px] font-bold text-[#17231c]">{money(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-xl border border-[#e8ece9] bg-white px-5 py-12 text-center">
                <ShoppingBag className="mx-auto text-[#a8b2ac]" size={30} />
                <h2 className="mt-3 font-semibold">Your cart is empty</h2>
                <p className="mt-1 text-sm text-[#78827d]">Find something you love and it will show up here.</p>
                <Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#159b4b] px-4 py-2 text-sm font-semibold text-white">Explore products <ArrowLeft size={14} /></Link>
              </div>
            )}
            <div className="flex items-center justify-between px-1 pt-0.5 text-[10px]">
              <Link href="/shop" className="inline-flex items-center gap-1 font-medium text-[#159447] hover:underline"><ArrowLeft size={12} /> Continue Shopping</Link>
              <button type="button" disabled={!items.length || clearCartMutation.isPending} onClick={handleClearCart} className="inline-flex items-center gap-1 text-[#8b9690] hover:text-[#d65b5b] disabled:opacity-40"><Trash2 size={11} /> Clear all items</button>
            </div>
          </section>

          <aside className="overflow-hidden rounded-xl border border-[#e7ece8] bg-white shadow-[0_2px_10px_rgba(25,52,37,0.03)]">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#159a49] to-[#09853b] px-4 py-3 text-white">
              <div className="flex items-center gap-2"><ShoppingBag size={15} aria-hidden="true" /><h2 className="text-[13px] font-bold">Order Summary</h2></div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px]">{itemCount} items</span>
            </div>
            <div className="p-3.5 sm:p-4">
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#f0faf3] px-3 py-2.5">
                <span className="flex size-7 items-center justify-center rounded-md bg-[#d9f4e2] text-[#159447]"><Truck size={14} /></span>
                <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-[#217b40]">Free Shipping!</p><p className="text-[9px] text-[#7b8d80]">You qualify for free delivery</p></div>
                <Check size={14} className="text-[#159447]" />
              </div>

              <div className="space-y-2.5 border-b border-dashed border-[#e6ebe7] pb-3 text-[10px]">
                <div className="flex justify-between"><span className="text-[#79837d]">Subtotal</span><span className="font-medium">{money(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[#79837d]">Shipping</span><span className="font-semibold text-[#159447]">{shipping === 0 ? "FREE" : money(shipping)}</span></div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[11px] font-semibold">Total</span>
                <span className="text-[17px] font-extrabold tracking-tight">{money(total)}<span className="ml-1 text-[9px] font-medium text-[#929b95]">EGP</span></span>
              </div>

              <Link href="/checkout" aria-disabled={!items.length} className={`flex h-[38px] w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#159b4b] to-[#0c873c] text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(13,137,60,0.2)] transition hover:brightness-95 ${!items.length ? "pointer-events-none opacity-50" : ""}`}>
                <LockKeyhole size={13} /> Secure Checkout <ChevronRight size={13} />
              </Link>
              <div className="mt-3 flex items-center justify-center gap-3 text-[8px] text-[#829087]">
                <span className="inline-flex items-center gap-1"><ShieldCheck size={11} className="text-[#1ba251]" /> Secure Payment</span><span>•</span><span className="inline-flex items-center gap-1"><Truck size={11} className="text-[#518ce6]" /> Fast Delivery</span>
              </div>
              <Link href="/shop" className="mt-3 flex items-center justify-center gap-1 text-[9px] font-medium text-[#168d43] hover:underline"><ArrowLeft size={11} /> Continue Shopping</Link>
            </div>
          </aside>
        </div>
      </div>

    </main>
  );
}
