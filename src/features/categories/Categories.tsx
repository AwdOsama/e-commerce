import Image from "next/image";
import Link from "next/link";
import { getCategory } from "./apis/getCategories";

export default async function Categories() {
  const categories = await getCategory();

  return (
    <section id="category-list" aria-labelledby="categories-heading" className="w-full">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 id="categories-heading" className="border-l-4 border-primary pl-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Shop By <span className="text-primary">Category</span>
        </h1>
        <Link href="/categories#category-list" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          View All Categories <span aria-hidden="true">→</span>
        </Link>
      </div>

      {categories.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category._id}>
              <Link
                href={`/shop?category=${encodeURIComponent(category._id)}`}
                className="group flex min-h-32 flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-4 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="relative mb-2.5 size-16 overflow-hidden rounded-full bg-muted sm:size-[72px]">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="72px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </span>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
          No categories are available right now.
        </p>
      )}
    </section>
  );
}
