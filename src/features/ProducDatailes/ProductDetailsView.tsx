"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import calcRate from "@/utlites/calc-rate";
import type { ProductInterface } from "../Products/interfaces/producy.inter";
import { usePreferences } from "@/components/ui-preferences";
import CartButtonCom from "@/src/features/cart/components/CartButtonCom";
import WishlistButton from "@/src/features/wishlist/components/WishlistButton";
import ProductInformationTabs from "./ProductInformationTabs";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

export default function ProductDetailsView({
  product,
  relatedProducts,
}: {
  product: ProductInterface;
  relatedProducts: ReactNode;
}) {
  const productImages = Array.from(
    new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean)),
  );
  const [selectedImage, setSelectedImage] = useState(productImages[0] ?? "");
  const [quantity, setQuantity] = useState(product.quantity > 0 ? 1 : 0);
  const reduceMotion = useReducedMotion();
  const { t } = usePreferences();
  const price = product.priceAfterDiscount ?? product.price;
  const hasDiscount = price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - price) / product.price) * 100)
    : 0;

  return (
    <main className="container py-8 sm:py-12">
      <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section aria-label={t("productImages")} className="min-w-0">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted">
              {selectedImage ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.title}
                    className="h-full w-full object-contain"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.97, x: 12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99, x: -12 }}
                    transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                  />
                </AnimatePresence>
              ) : (
                <span className="text-sm text-muted-foreground">{t("imageUnavailable")}</span>
              )}
              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white">
                  {t("save")} {discountPercent}%
                </span>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {productImages.map((image, index) => (
                  <motion.button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    aria-label={`${t("showImage")} ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    className={`aspect-square overflow-hidden rounded-lg border-2 bg-muted p-1 transition ${
                      selectedImage === image
                        ? "border-emerald-700"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              {product.brand?.name || "Fresh Cart"}
              <span className="mx-2 text-border">/</span>
              <span className="text-muted-foreground">{product.category?.name}</span>
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {calcRate(product.ratingsAverage)}
              <span className="text-sm font-semibold text-foreground">
                {product.ratingsAverage.toFixed(1)}
              </span>
              <span className="text-sm text-stone-500">
                ({product.ratingsQuantity} {t("reviews")})
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-bold text-foreground">{formatPrice(price)}</p>
              {hasDiscount && (
                <p className="text-lg text-stone-400 line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm font-medium">
              <span
                className={`size-2.5 rounded-full ${product.quantity > 0 ? "bg-emerald-500" : "bg-red-500"}`}
              />
              <span className={product.quantity > 0 ? "text-emerald-700" : "text-red-600"}>
                {product.quantity > 0 ? t("inStock") : t("outOfStock")}
              </span>
            </p>

            <p className="mt-6 leading-7 text-stone-600">{product.description}</p>

            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold text-foreground">{t("quantity")}</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-11 items-center rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity <= 1}
                    aria-label={t("decreaseQuantity")}
                    className="flex size-11 items-center justify-center text-stone-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(product.quantity, current + 1))}
                    disabled={quantity >= product.quantity}
                    aria-label={t("increaseQuantity")}
                    className="flex size-11 items-center justify-center text-stone-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{product.quantity} {t("available")}</span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-stone-100 pt-5">
              <span className="text-sm font-medium text-muted-foreground">{t("totalPrice")}</span>
              <span className="text-lg font-bold text-emerald-700">
                {formatPrice(price * quantity)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <CartButtonCom
                productId={product._id}
                disabled={product.quantity < 1 || quantity < 1}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <><ShoppingCart size={18} /> {t("addToCart")}</>
              </CartButtonCom>
              <button
                type="button"
                disabled={product.quantity < 1}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-950 px-5 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap size={17} /> {t("buyNow")}
              </button>
            </div>

            <WishlistButton productId={product._id} productName={product.title} variant="label" />
          </section>
        </div>

        <div className="mt-10 grid gap-5 border-t border-stone-100 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="text-emerald-700" size={21} />
            <div>
              <p className="text-sm font-semibold text-foreground">{t("fastDelivery")}</p>
              <p className="text-xs text-muted-foreground">{t("deliveryTime")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="text-emerald-700" size={21} />
            <div>
              <p className="text-sm font-semibold text-foreground">{t("returns")}</p>
              <p className="text-xs text-muted-foreground">{t("returnPolicy")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-700" size={21} />
            <div>
              <p className="text-sm font-semibold text-foreground">{t("securePayment")}</p>
              <p className="text-xs text-muted-foreground">{t("paymentSafe")}</p>
            </div>
          </div>
        </div>
      </div>

      <ProductInformationTabs product={product} />

      <section className="mt-12" aria-labelledby="related-products-title">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            {t("moreExplore")}
          </p>
          <h2 id="related-products-title" className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {t("relatedProducts")}
          </h2>
        </div>
        {relatedProducts}
      </section>
    </main>
  );
}
