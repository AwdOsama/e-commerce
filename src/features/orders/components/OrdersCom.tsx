"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Clock3, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { getUserOrders, ordersQueryKey } from "../apis/orders.api";
import type { UserOrder } from "../interfaces/order.interface";

const money = (amount: number) => `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(amount)} EGP`;

function orderDate(value?: string) {
  if (!value) return "Date unavailable";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-EG", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

function paymentName(value?: string) {
  if (!value) return "Payment method unavailable";
  const normalized = value.toLowerCase();
  return normalized.includes("cash") ? "Cash on Delivery" : normalized.includes("stripe") || normalized.includes("card") ? "Pay Online" : value;
}

function statusDetails(order: UserOrder) {
  if (order.isDelivered) return { label: "Delivered", className: "bg-[#e9f8ee] text-[#168d43]", icon: <PackageCheck size={11} /> };
  if (order.isPaid) return { label: "Processing", className: "bg-[#eaf4ff] text-[#3681ce]", icon: <Truck size={11} /> };
  return { label: "Pending", className: "bg-[#fff5dc] text-[#d58c08]", icon: <Clock3 size={11} /> };
}

function OrderCard({ order, index }: { order: UserOrder; index: number }) {
  const status = statusDetails(order);
  const itemCount = order.products.reduce((sum, product) => sum + product.count, 0);
  const productsSubtotal = order.products.reduce((sum, product) => sum + product.price * product.count, 0);
  const shipping = Math.max(0, order.totalOrderPrice - productsSubtotal);
  const orderCode = order._id.slice(-6).toUpperCase();

  return (
    <details open={index === 0} className="group overflow-hidden rounded-xl border border-[#e5ece7] bg-white shadow-[0_2px_10px_rgba(25,52,37,0.025)]">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-3.5 sm:p-4 [&::-webkit-details-marker]:hidden">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f3f6f4] text-[#159447]">
          {order.products[0]?.imageCover ? <Image unoptimized width={48} height={48} src={order.products[0].imageCover} alt="" className="size-full object-contain" /> : <PackageCheck size={20} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${status.className}`}>{status.icon}{status.label}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#7e8982]">
            <span className="font-semibold text-[#344139]">Order #{orderCode}</span><span>•</span><span>{orderDate(order.createdAt)}</span><span>•</span><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span><span>•</span><span>{paymentName(order.paymentMethodType)}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3"><span className="text-right"><span className="block text-[9px] text-[#97a19a]">Total</span><span className="text-xs font-bold text-[#1f2b23]">{money(order.totalOrderPrice)}</span></span><span className="rounded-md border border-[#e3e9e5] px-2 py-1 text-[9px] font-medium text-[#68756c] transition group-open:border-[#b8e5c6] group-open:bg-[#f0faf3] group-open:text-[#159447]">Details</span></span>
      </summary>

      <div className="border-t border-[#edf1ee] px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(215px,0.9fr)]">
          <section className="min-w-0">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#7c8980]">Order Items</h2>
            <div className="space-y-2">
              {order.products.length ? order.products.map((product, itemIndex) => (
                <div key={`${product._id ?? product.title}-${itemIndex}`} className="flex items-center gap-2.5 rounded-lg bg-[#fbfcfb] p-2">
                  <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">{product.imageCover ? <Image unoptimized width={40} height={40} src={product.imageCover} alt="" className="size-full object-contain" /> : <ShoppingBag size={15} className="text-[#9ba69e]" />}</span>
                  <span className="min-w-0 flex-1"><span className="block line-clamp-1 text-[10px] font-semibold text-[#344139]">{product.title}</span><span className="mt-0.5 block text-[9px] text-[#89948d]">Qty: {product.count}</span></span>
                  <span className="shrink-0 text-[10px] font-semibold">{money(product.price * product.count)}</span>
                </div>
              )) : <p className="rounded-lg bg-[#fbfcfb] p-3 text-[10px] text-[#89948d]">Item details are unavailable for this order.</p>}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <section className="rounded-lg border border-[#e9eeea] p-3">
              <h2 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-[#344139]"><Truck size={12} className="text-[#159447]" />Delivery Address</h2>
              <p className="text-[9px] leading-4 text-[#738078]">{order.shippingAddress?.details || "Address details unavailable"}{order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}</p>
              {order.shippingAddress?.phone && <p className="mt-1 text-[9px] text-[#89948d]">{order.shippingAddress.phone}</p>}
            </section>
            <section className="rounded-lg bg-[#fff8dc] p-3">
              <h2 className="mb-2 text-[10px] font-bold text-[#4a4634]">Order Summary</h2>
              <div className="space-y-1.5 text-[9px]">
                <div className="flex justify-between gap-2"><span className="text-[#827b5a]">Subtotal</span><span>{money(productsSubtotal)}</span></div>
                <div className="flex justify-between gap-2"><span className="text-[#827b5a]">Shipping</span><span>{shipping ? money(shipping) : "FREE"}</span></div>
                <div className="flex justify-between border-t border-[#eae0b8] pt-1.5 font-bold"><span>Total</span><span className="text-[#159447]">{money(order.totalOrderPrice)}</span></div>
              </div>
            </section>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#168d43]"><Check size={11} />{paymentName(order.paymentMethodType)} <span className="text-[#9ba69e">·</span>{order.isPaid ? "Payment received" : "Payment due on delivery"}</div>
      </div>
    </details>
  );
}

export default function OrdersCom() {
  const ordersQuery = useQuery({ queryKey: ordersQueryKey, queryFn: getUserOrders, retry: false, refetchOnMount: "always", refetchOnWindowFocus: true });
  const orders = ordersQuery.data ?? [];

  return (
    <main className="min-h-[65vh] flex-1 bg-[#f7f9f7] pb-10 text-[#18231e]">
      <div className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#e8f6ed] text-[#159447]"><ShoppingBag size={19} /></span><div><p className="text-[10px] text-[#89948d]">Home&nbsp; / &nbsp;My Orders</p><h1 className="mt-0.5 text-xl font-bold sm:text-2xl">My Orders</h1><p className="mt-1 text-[11px] text-[#79827d]">Track your purchases and view order details.</p></div></div>
          <Link href="/shop" className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#159447] hover:underline">Continue Shopping <ArrowRight size={13} /></Link>
        </div>

        {ordersQuery.isPending ? <div role="status" className="rounded-xl border border-[#e5ece7] bg-white p-10 text-center text-sm text-[#748078]">Loading your orders…</div> : ordersQuery.isError ? (
          <div role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center"><p className="font-semibold">We couldn’t load your orders.</p><p className="mt-1 text-xs text-[#78827d]">{ordersQuery.error.message}</p><button type="button" onClick={() => void ordersQuery.refetch()} className="mt-4 rounded-md bg-[#159b4b] px-4 py-2 text-xs font-semibold text-white">Try again</button></div>
        ) : orders.length ? (
          <div className="space-y-3">{orders.map((order, index) => <OrderCard key={order._id} order={order} index={index} />)}</div>
        ) : (
          <section className="rounded-xl border border-[#e5ece7] bg-white px-5 py-14 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eff8f2] text-[#159447]"><ShoppingBag size={21} /></span><h2 className="mt-3 text-base font-bold">No orders yet</h2><p className="mt-1 text-xs text-[#7e8982]">Your completed purchases will show up here.</p><Link href="/shop" className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-[#159b4b] px-4 text-xs font-semibold text-white">Start Shopping</Link></section>
        )}
      </div>
    </main>
  );
}
