import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LocalizedText } from "@/components/ui-preferences";
import ProductItem from "./ProductItem";
import { getProducts } from "./apis/products.api";

export default async function FeaturedProducts() {
  const response = await getProducts();
  const products = response.data?.slice(0, 4) ?? [];

  return (
    <section
      aria-labelledby="featured-products-title"
      className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10"
    >
      <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <LocalizedText k="curated" />
          </p>
          <h2
            id="featured-products-title"
            className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            <LocalizedText k="featuredProducts" />
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            <LocalizedText k="featuredProductsDescription" />
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:text-sm"
        >
          <LocalizedText k="viewAllProducts" />
          <ArrowRight aria-hidden="true" size={15} className="rtl:rotate-180" />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <ProductItem key={product.id || product._id} prod={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted p-6 text-sm text-muted-foreground">
          <LocalizedText k="noProducts" />
        </p>
      )}
    </section>
  );
}
