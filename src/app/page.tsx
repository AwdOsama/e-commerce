import { Suspense } from "react";
import Swiper from "@/components/Swiper";
import Categories from "@/src/features/categories/Categories";
import FeaturedProducts from "@/src/features/Products/FeaturedProducts";
import { HomeNewsletter, HomePromotions } from "@/src/features/home/HomeSupportingSections";

export default function Home() {
  return (
    <main className="w-full flex-1">
      <Swiper />
      <Suspense
        fallback={
          <section aria-label="Loading categories" aria-busy="true" className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
            <div className="mb-8 h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="size-16 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </section>
        }
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
          <Categories />
        </div>
      </Suspense>
      <HomePromotions />
      <Suspense
        fallback={
          <section aria-label="Loading featured products" aria-busy="true" className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
            <div className="mb-8 h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card p-3">
                  <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="mt-5 h-8 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </section>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <HomeNewsletter />
    </main>
  );
}
