"use client";

import Link from "next/link";
import { useAddProductToCart } from "@/src/features/cart/hooks/useCart";
import { useRemoveFromWishlist, useWishlistQuery } from "../hooks/useWishlist";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ProductInterface } from "@/src/features/Products/interfaces/producy.inter";

const money = (price: number) => new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(price) + " EGP";

function WishlistRow({ product, onRemove, onAddToCart, cartBusy, removeBusy }: { product: ProductInterface; onRemove: () => void; onAddToCart: () => void; cartBusy: boolean; removeBusy: boolean }) {
  const price = product.priceAfterDiscount ?? product.price;
  return <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#edf0ee] px-3 py-3 last:border-b-0 sm:grid-cols-[minmax(250px,1.6fr)_minmax(90px,.6fr)_minmax(80px,.5fr)_minmax(140px,.8fr)] sm:gap-4 sm:px-5">
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <Link href={`/productDatailes/${product._id}`} className="flex size-[62px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f6f7f6] sm:size-[74px]">
        {product.imageCover ? <img src={product.imageCover} alt={product.title} className="size-full object-contain mix-blend-multiply" loading="lazy"/> : <Heart size={19} className="text-[#b8c1bc]"/>}
      </Link>
      <div className="min-w-0"><Link href={`/productDatailes/${product._id}`} className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#26312b] hover:text-[#159447] sm:text-xs">{product.title}</Link><p className="mt-1 truncate text-[9px] text-[#89938d]">{product.brand?.name || product.category?.name || "FreshCart"}</p><p className="mt-1 text-[9px] text-[#929b95] sm:hidden">{money(price)} · <span className={product.quantity > 0 ? "text-[#159447]" : "text-red-500"}>{product.quantity > 0 ? "In Stock" : "Out of Stock"}</span></p></div>
    </div>
    <div className="hidden text-[11px] font-semibold text-[#26312b] sm:block">{money(price)}</div>
    <div className="hidden sm:block"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${product.quantity > 0 ? "bg-[#eaf8ee] text-[#159447]" : "bg-red-50 text-red-600"}`}>{product.quantity > 0 ? "In Stock" : "Out of Stock"}</span></div>
    <div className="flex items-center justify-end gap-2">
      <button type="button" onClick={onAddToCart} disabled={cartBusy || product.quantity < 1} className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-[#159b4b] px-2.5 text-[9px] font-semibold text-white transition hover:bg-[#11833f] disabled:opacity-50 sm:px-3"><ShoppingCart size={12}/><span className="hidden sm:inline">{cartBusy ? "Adding…" : "Add to Cart"}</span><span className="sm:hidden">Add</span></button>
      <button type="button" onClick={onRemove} disabled={removeBusy} aria-label={`Remove ${product.title} from wishlist`} className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#e8ece9] text-[#89938d] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 size={13}/></button>
    </div>
  </article>;
}

export default function WishlistCom() {
  const wishlistQuery = useWishlistQuery();
  const removeMutation = useRemoveFromWishlist();
  const addCartMutation = useAddProductToCart();
  const products = wishlistQuery.data?.payload.data ?? [];

  async function remove(productId: string) {
    try { await removeMutation.mutateAsync(productId); toast.success("Removed from your wishlist."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to remove this product."); }
  }

  async function addToCart(productId: string) {
    try { await addCartMutation.mutateAsync(productId); toast.success("Added to cart."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to add this product to cart."); }
  }

  return <main className="flex-1 bg-[#f7f8f7] pb-10 pt-2 text-[#18231e]">
    <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-start gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#fff0f2] text-rose-500"><Heart size={18} fill="currentColor"/></span><div><h1 className="text-[21px] font-bold leading-6 tracking-[-0.03em] sm:text-2xl">My Wishlist</h1><p className="mt-1 text-[11px] text-[#79827d]">{products.length} {products.length === 1 ? "item" : "items"} saved</p></div></div>
      {wishlistQuery.isPending ? <div role="status" className="rounded-xl border border-[#e8ece9] bg-white px-5 py-12 text-center text-sm text-[#78827d]">Loading your wishlist…</div> : wishlistQuery.isError ? <div role="alert" className="rounded-xl border border-[#f2d6d6] bg-white px-5 py-10 text-center"><h2 className="font-semibold">We couldn’t load your wishlist</h2><p className="mt-1 text-sm text-[#78827d]">Please refresh the page and try again.</p></div> : products.length ? <section aria-label="Wishlist products" className="overflow-hidden rounded-xl border border-[#e8ece9] bg-white shadow-[0_2px_10px_rgba(25,52,37,0.025)]">
        <div className="hidden grid-cols-[minmax(250px,1.6fr)_minmax(90px,.6fr)_minmax(80px,.5fr)_minmax(140px,.8fr)] gap-4 bg-[#fafbfa] px-5 py-3 text-[9px] font-semibold uppercase tracking-wide text-[#77817b] sm:grid"><span>Product</span><span>Price</span><span>Status</span><span className="text-right">Actions</span></div>
        {products.map((product) => <WishlistRow key={product._id} product={product} onRemove={() => void remove(product._id)} onAddToCart={() => void addToCart(product._id)} cartBusy={addCartMutation.isPending} removeBusy={removeMutation.isPending}/>)}
      </section> : <div className="rounded-xl border border-[#e8ece9] bg-white px-5 py-12 text-center"><Heart className="mx-auto text-[#a8b2ac]" size={30}/><h2 className="mt-3 font-semibold">Your wishlist is empty</h2><p className="mt-1 text-sm text-[#78827d]">Save the products you love and they’ll be waiting here.</p><Link href="/shop" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#159b4b] px-4 py-2 text-sm font-semibold text-white">Explore products <ShoppingCart size={14}/></Link></div>}
      <div className="flex justify-start px-1 pt-3 text-[10px]"><Link href="/shop" className="font-medium text-[#159447] hover:underline">← Continue Shopping</Link></div>
    </div>
  </main>;
}
