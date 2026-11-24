import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrands } from "@/src/features/brands/apis/brands.api";
import { getCategory } from "@/src/features/categories/apis/getCategories";
import { getProducts } from "@/src/features/Products/apis/products.api";
import type { ProductRes } from "@/src/features/Products/interfaces/producy.inter";
import SearchResultsPage from "@/src/features/search/components/SearchResultsPage";

export const metadata: Metadata = { title: "Search Products" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const emptyProducts: ProductRes = { results: 0, metadata: { currentPage: 1, numberOfPages: 1, limit: 12, nextPage: 0 }, data: [] };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<div className="mx-auto min-h-[50vh] w-full max-w-[1440px] px-4 py-8" aria-label="Loading search results" />}>
    <SearchPageContent searchParams={searchParams} />
  </Suspense>;
}

async function SearchPageContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (first(params.q) ?? first(params.keyword) ?? "").trim();
  const categoryId = first(params.category) ?? "";
  const brandId = first(params.brand) ?? "";
  const min = positiveNumber(first(params.min));
  const max = positiveNumber(first(params.max));
  const sort = first(params.sort) ?? "relevance";
  const requestedPage = Math.floor(Number(first(params.page) ?? 1));
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [productResult, categoriesResult, brandsResult] = await Promise.allSettled([
    getProducts(categoryId || undefined, brandId || undefined, query || undefined, { minPrice: min, maxPrice: max, sort, page, limit: 12 }),
    getCategory(),
    getBrands(),
  ]);

  const loadError = productResult.status === "rejected" ? "We couldn’t load products right now. Please try again." : undefined;
  const products = productResult.status === "fulfilled" ? productResult.value : emptyProducts;
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];

  return <SearchResultsPage
    products={products}
    categories={categories}
    brands={brands}
    query={query}
    selectedCategory={categoryId}
    selectedBrand={brandId}
    minPrice={min === undefined ? "" : String(min)}
    maxPrice={max === undefined ? "" : String(max)}
    sort={sort}
    loadError={loadError}
  />;
}
