import type { Metadata } from "next";
import { Suspense } from "react";
import Categories from "@/src/features/categories/Categories";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <main className="container py-8 sm:py-12">
      <Suspense
        fallback={
          <section aria-label="Loading categories" aria-busy="true">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="h-8 w-56 animate-pulse rounded bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <li
                  key={index}
                  className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card px-3 py-4"
                >
                  <span className="size-16 animate-pulse rounded-full bg-muted sm:size-[72px]" />
                  <span className="h-4 w-20 animate-pulse rounded bg-muted" />
                </li>
              ))}
            </ul>
          </section>
        }
      >
        <Categories />
      </Suspense>
    </main>
  );
}
