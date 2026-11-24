"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, CreditCard, LockKeyhole, MapPin, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { useCartQuery } from "@/src/features/cart/hooks/useCart";
import { cartQueryKey } from "@/src/features/cart/apis/cart.api";
import { useAddressesQuery } from "@/src/features/addresses/hooks/useAddresses";
import type { UserAddress } from "@/src/features/addresses/interfaces/address.interface";
import { checkoutSchema, type CheckoutValues } from "../schema/checkout.schema";

type PaymentMethod = "cash" | "online";
type OrderResponse = { payload?: unknown; message?: string; checkoutUrl?: string; [key: string]: unknown };
const EMPTY_ADDRESSES: UserAddress[] = [];

async function submitOrder(endpoint: string, body: unknown): Promise<OrderResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const result = await response.json().catch(() => null) as OrderResponse | null;
  if (!response.ok) throw new Error(result?.message || "We could not place your order. Please try again.");
  return result ?? {};
}

function findCheckoutUrl(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.url === "string") return record.url;
  if (typeof record.checkoutUrl === "string") return record.checkoutUrl;
  for (const key of ["payload", "data", "session"]) {
    const found = findCheckoutUrl(record[key]);
    if (found) return found;
  }
  return null;
}

const money = (amount: number) => `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(amount)} EGP`;

export default function CheckoutCom() {
  const queryClient = useQueryClient();
  const cartQuery = useCartQuery();
  const addressesQuery = useAddressesQuery();
  const addresses = addressesQuery.data?.payload.data ?? EMPTY_ADDRESSES;
  const products = cartQuery.data?.payload.data.products ?? [];
  const cartId = cartQuery.data?.payload.cartId;
  const subtotal = Number(cartQuery.data?.payload.data.totalCartPrice ?? products.reduce((sum, line) => sum + (line.price ?? line.product.priceAfterDiscount ?? line.product.price) * line.count, 0));
  const shipping = subtotal === 0 || subtotal >= 500 ? 0 : 50;
  const [selectedAddress, setSelectedAddress] = useState<string | "custom">("");
  const activeAddress = selectedAddress || addresses[0]?._id || "custom";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [placed, setPlaced] = useState(false);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { city: "", details: "", phone: "" },
  });

  const orderMutation = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      if (!cartId) throw new Error("Your cart is unavailable. Please return to the cart and try again.");
      const address = activeAddress !== "custom"
        ? addresses.find((item) => item._id === activeAddress)
        : undefined;
      const shippingAddress = address
        ? { city: address.city, details: address.details, phone: address.phone }
        : values;

      if (paymentMethod === "cash") {
        return submitOrder("/api/checkout/cash", { cartId, shippingAddress });
      }
      const response = await submitOrder("/api/checkout/online", { cartId, url: window.location.origin, shippingAddress });
      const checkoutUrl = findCheckoutUrl(response);
      if (!checkoutUrl) throw new Error("The payment provider did not return a checkout link.");
      const parsedUrl = new URL(checkoutUrl);
      if (parsedUrl.protocol !== "https:" || !/(^|\.)stripe\.com$/i.test(parsedUrl.hostname)) {
        throw new Error("The payment provider returned an invalid checkout link.");
      }
      return { ...response, checkoutUrl: parsedUrl.toString() };
    },
    onSuccess: async (response) => {
      if (paymentMethod === "online") {
        if (response.checkoutUrl) window.location.assign(response.checkoutUrl);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: cartQueryKey, refetchType: "all" });
      setPlaced(true);
      toast.success("Your order has been placed.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "We could not place your order."),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (activeAddress !== "custom") {
      event.preventDefault();
      orderMutation.mutate({ city: "", details: "", phone: "" });
      return;
    }
    void form.handleSubmit((values) => orderMutation.mutate(values))(event);
  };
  const chooseAddress = (address: UserAddress) => {
    setSelectedAddress(address._id);
    form.setValue("city", address.city, { shouldValidate: true });
    form.setValue("details", address.details, { shouldValidate: true });
    form.setValue("phone", address.phone, { shouldValidate: true });
  };
  const useCustomAddress = () => {
    setSelectedAddress("custom");
    form.reset({ city: "", details: "", phone: "" });
  };

  if (placed) return (
    <main className="min-h-[55vh] bg-[#f7f9f7] px-4 py-16 text-[#18231e]">
      <section className="mx-auto max-w-xl rounded-2xl border border-[#e5ece7] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f8ee] text-[#159b4b]"><Check size={28} /></span>
        <h1 className="mt-4 text-2xl font-bold">Order placed successfully</h1>
        <p className="mt-2 text-sm text-[#748078]">Your cash on delivery order is confirmed. We’ll prepare it for delivery.</p>
        <Link href="/shop" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#159b4b] px-6 text-sm font-semibold text-white">Continue Shopping</Link>
      </section>
    </main>
  );

  return (
    <main className="min-h-[65vh] bg-[#f7f9f7] pb-12 text-[#18231e]">
      <div className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#e8f6ed] text-[#159447]"><ShoppingBag size={20} /></span>
            <div><h1 className="text-xl font-bold sm:text-2xl">Complete Your Order</h1><p className="mt-1 text-xs text-[#79827d]">Review your items and complete your purchase.</p></div>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-1 text-xs font-semibold text-[#159447] hover:underline"><ArrowLeft size={14} /> Back to Cart</Link>
        </div>

        {cartQuery.isPending ? <div role="status" className="rounded-xl bg-white p-10 text-center text-sm text-[#748078]">Loading your order…</div> : cartQuery.isError ? (
          <div role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center"><p className="font-semibold">Your cart could not be loaded.</p><Link href="/cart" className="mt-3 inline-flex text-sm text-[#159447]">Return to cart</Link></div>
        ) : !products.length ? (
          <div className="rounded-xl border border-[#e5ece7] bg-white p-10 text-center"><p className="font-semibold">Your cart is empty.</p><Link href="/shop" className="mt-3 inline-flex text-sm text-[#159447]">Explore products</Link></div>
        ) : (
          <form onSubmit={submit} className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.82fr)]">
            <div className="space-y-4">
              <section className="overflow-hidden rounded-xl border border-[#e4ebe6] bg-white">
                <header className="flex items-center gap-2 bg-gradient-to-r from-[#159b4b] to-[#20c966] px-4 py-3 text-white"><MapPin size={15} /><div><h2 className="text-sm font-bold">Shipping Address</h2><p className="text-[10px] text-white/80">Where should we deliver your order?</p></div></header>
                <div className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-center justify-between"><h3 className="text-xs font-semibold">Saved Addresses</h3><Link href="/profile/addresses" className="text-[10px] font-medium text-[#159447] hover:underline">Manage addresses</Link></div>
                  {addressesQuery.isPending && <p className="text-xs text-[#89938d]">Loading saved addresses…</p>}
                  {addressesQuery.isError && <p className="text-xs text-[#b25353]">Saved addresses are unavailable. You can enter a different address below.</p>}
                  {addresses.map((address) => (
                    <button key={address._id} type="button" disabled={orderMutation.isPending} onClick={() => chooseAddress(address)} className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition disabled:cursor-wait ${activeAddress === address._id ? "border-[#21b85b] bg-[#f1fbf4]" : "border-[#e8ece9] hover:border-[#b9dfc5]"}`}>
                      <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${activeAddress === address._id ? "border-[#159b4b] bg-[#159b4b] text-white" : "border-[#cbd4ce]"}`}>{activeAddress === address._id && <Check size={10} />}</span>
                      <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{address.name} <span className="ml-1 rounded bg-[#edf8f0] px-1.5 py-0.5 text-[9px] font-medium text-[#168d43]">{address.city}</span></span><span className="mt-1 block text-[10px] leading-4 text-[#79827d]">{address.details} · {address.phone}</span></span>
                    </button>
                  ))}
                  <button type="button" disabled={orderMutation.isPending} onClick={useCustomAddress} className={`flex w-full items-center gap-2 rounded-lg border border-dashed p-3 text-left text-xs font-medium transition disabled:cursor-wait ${activeAddress === "custom" ? "border-[#20b85b] bg-[#f2fbf5] text-[#159447]" : "border-[#dfe7e1] text-[#5f6d64] hover:border-[#20b85b]"}`}>
                    <span className="flex size-5 items-center justify-center rounded bg-[#dbf5e4]"><MapPin size={12} /></span>Use a different address
                  </button>
                  {activeAddress === "custom" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="City" error={form.formState.errors.city?.message}><input {...form.register("city")} placeholder="e.g. Cairo, Alexandria, Giza" className={inputClass} /></Field>
                      <Field label="Phone Number" error={form.formState.errors.phone?.message}><input {...form.register("phone")} placeholder="01xxxxxxxxx" inputMode="tel" className={inputClass} /></Field>
                      <div className="sm:col-span-2"><Field label="Street Address" error={form.formState.errors.details?.message}><textarea {...form.register("details")} rows={2} placeholder="Street name, building number, floor, apartment…" className={`${inputClass} min-h-16 resize-y py-2`} /></Field></div>
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#e4ebe6] bg-white">
                <header className="flex items-center gap-2 bg-gradient-to-r from-[#159b4b] to-[#20c966] px-4 py-3 text-white"><CreditCard size={15} /><div><h2 className="text-sm font-bold">Payment Method</h2><p className="text-[10px] text-white/80">Choose how you’d like to pay</p></div></header>
                <div className="space-y-2.5 p-4 sm:p-5">
                  <PaymentChoice disabled={orderMutation.isPending} selected={paymentMethod === "cash"} onClick={() => setPaymentMethod("cash")} icon={<Truck size={17} />} title="Cash on Delivery" description="Pay when your order arrives at your doorstep." />
                  <PaymentChoice disabled={orderMutation.isPending} selected={paymentMethod === "online"} onClick={() => setPaymentMethod("online")} icon={<CreditCard size={17} />} title="Pay Online" description="Secure payment with credit/debit card via Stripe." />
                  <div className="flex items-center gap-2 rounded-lg bg-[#f0faf3] p-3 text-[10px] text-[#4d755b]"><ShieldCheck size={15} className="shrink-0 text-[#159b4b]" /><span><b className="text-[#267742]">Secure &amp; Encrypted</b><br />Your payment details are protected with SSL encryption.</span></div>
                </div>
              </section>
            </div>

            <aside className="overflow-hidden rounded-xl border border-[#e4ebe6] bg-white shadow-[0_2px_12px_rgba(25,52,37,0.04)] lg:sticky lg:top-5">
              <header className="flex items-center justify-between bg-gradient-to-r from-[#159b4b] to-[#09853b] px-4 py-3 text-white"><div className="flex items-center gap-2"><ShoppingBag size={15} /><h2 className="text-sm font-bold">Order Summary</h2></div><span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{products.reduce((sum, item) => sum + item.count, 0)} items</span></header>
              <div className="max-h-64 space-y-3 overflow-y-auto p-4">
                {products.map((line) => { const price = line.price ?? line.product.priceAfterDiscount ?? line.product.price; return <div key={line._id} className="flex gap-3"><div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f4f6f4]">{line.product.imageCover && <img src={line.product.imageCover} alt="" className="size-full object-contain" />}</div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-[11px] font-semibold">{line.product.title}</p><p className="mt-1 text-[10px] text-[#8a948e]">Qty: {line.count}</p></div><span className="shrink-0 text-[10px] font-semibold">{money(price * line.count)}</span></div>; })}
              </div>
              <div className="mx-4 border-t border-dashed border-[#e1e8e3]" />
              <div className="space-y-3 p-4 text-xs">
                <div className="flex justify-between"><span className="text-[#79837d]">Subtotal</span><span className="font-medium">{money(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[#79837d]">Shipping</span><span className="font-semibold text-[#159447]">{shipping ? money(shipping) : "FREE"}</span></div>
                <div className="flex justify-between border-t border-[#edf0ed] pt-3"><span className="font-semibold">Total</span><span className="text-base font-extrabold">{money(subtotal + shipping)}</span></div>
                <button type="submit" disabled={orderMutation.isPending || !cartId} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#159b4b] text-sm font-bold text-white shadow-[0_3px_8px_rgba(13,137,60,0.2)] transition hover:bg-[#11833f] disabled:cursor-not-allowed disabled:opacity-60"><LockKeyhole size={15} />{orderMutation.isPending ? "Processing…" : paymentMethod === "cash" ? "Place Order" : "Continue to Payment"}</button>
                <p className="text-center text-[9px] leading-4 text-[#87928b]">By placing your order, you agree to our terms and privacy policy.</p>
                <div className="flex items-center justify-center gap-2 text-[9px] text-[#718076]"><ShieldCheck size={12} className="text-[#159b4b]" /> Secure <span>·</span> Fast Delivery <span>·</span> Easy Returns</div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

const inputClass = "mt-1.5 w-full rounded-lg border border-[#dfe6e1] bg-white px-3 py-2.5 text-xs text-[#26332b] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#20b85b] focus:ring-2 focus:ring-[#20b85b]/10";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold text-[#38463d]">{label}<span className="ml-0.5 text-red-500">*</span>{children}{error && <span role="alert" className="mt-1 block text-[10px] font-normal text-red-600">{error}</span>}</label>;
}

function PaymentChoice({ selected, onClick, disabled, icon, title, description }: { selected: boolean; onClick: () => void; disabled: boolean; icon: React.ReactNode; title: string; description: string }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition disabled:cursor-wait ${selected ? "border-[#20b85b] bg-[#f2fbf5]" : "border-[#e6ebe7] hover:border-[#b8dfc4]"}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${selected ? "bg-[#159b4b] text-white" : "bg-[#f1f3f2] text-[#89938d]"}`}>{icon}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{title}</span><span className="mt-0.5 block text-[10px] leading-4 text-[#849088]">{description}</span></span><span className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#159b4b] bg-[#159b4b] text-white" : "border-[#cbd4ce]"}`}>{selected && <Check size={10} />}</span></button>;
}
