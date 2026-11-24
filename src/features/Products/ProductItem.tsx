"use client";

import type { ProductInterface } from "./interfaces/producy.inter";
import { Plus } from "lucide-react";
import calcRate from "@/utlites/calc-rate";
import Link from "next/link";
import { usePreferences } from "@/components/ui-preferences";
import CartButtonCom from "@/src/features/cart/components/CartButtonCom";
import WishlistButton from "@/src/features/wishlist/components/WishlistButton";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductItem({ prod }: { prod: ProductInterface }) {
  const { t } = usePreferences();
  const hasDiscount =
    typeof prod.priceAfterDiscount === "number" &&
    prod.priceAfterDiscount < prod.price;
  const discountPercent = hasDiscount
    ? Math.round(((prod.price - prod.priceAfterDiscount!) / prod.price) * 100)
    : 0;
  const productImage = prod.imageCover || prod.images?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <WishlistButton productId={prod._id} productName={prod.title} />
        {productImage ? (
          <Link href={`/productDatailes/${prod._id}`}>
            <img
              src={productImage}
              alt={prod.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div
            role="img"
            aria-label={`${prod.title} image unavailable`}
            className="flex h-full items-center justify-center text-sm text-muted-foreground"
          >
            {t("imageUnavailable")}
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            {t("save")} {discountPercent}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {prod.brand?.name || prod.category?.name || "Fresh Cart"}
          </p>
          {typeof prod.ratingsAverage === "number" && (
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
              {calcRate(prod.ratingsAverage)}
              <span>{prod.ratingsAverage.toFixed(1)}</span>
            </span>
          )}
        </div>

        <h2 className="mt-2 line-clamp-2 min-h-12 text-base font-bold leading-6 text-foreground">
          {prod.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {prod.description}
        </p>

        <div className="mt-auto flex flex-wrap justify-between items-baseline gap-x-2 gap-y-1 pt-4">
          <p className="font-bold text-primary">
            {formatPrice(hasDiscount ? prod.priceAfterDiscount! : prod.price)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-stone-400 line-through">
              {formatPrice(prod.price)}
            </p>
          )}
          <CartButtonCom
            productId={prod._id}
            disabled={prod.quantity < 1}
            className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`${t("addToCart")}: ${prod.title}`}
          >
            <Plus color="white" />
          </CartButtonCom>
        </div>
      </div>
    </article>
  );
}
