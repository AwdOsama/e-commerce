"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Grid2X2, List, Search, SlidersHorizontal, Star } from "lucide-react";
import type { Brand, Category, ProductInterface, ProductRes } from "@/src/features/Products/interfaces/producy.inter";
import CartButtonCom from "@/src/features/cart/components/CartButtonCom";
import WishlistButton from "@/src/features/wishlist/components/WishlistButton";

type ViewMode = "grid" | "list";
type Props = {
  products: ProductRes;
  categories: Category[];
  brands: Brand[];
  query: string;
  selectedCategory: string;
  selectedBrand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  loadError?: string;
};

const money = (value: number) => `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(value)} EGP`;

function ProductCard({ product, list }: { product: ProductInterface; list: boolean }) {
  const actualPrice = product.priceAfterDiscount ?? product.price;
  const discount = product.price > actualPrice ? Math.round((product.price - actualPrice) / product.price * 100) : 0;
  const image = product.imageCover || product.images?.[0];

  return <article className={`group relative flex overflow-hidden rounded-lg border border-[#e5e9ec] bg-white transition hover:border-[#d3e8d9] hover:shadow-md ${list ? "flex-row items-center gap-4 p-3" : "flex-col"}`}>
    <div className={`relative shrink-0 overflow-hidden bg-[#f7f8f8] ${list ? "h-32 w-32 rounded-md sm:h-40 sm:w-40" : "aspect-square w-full"}`}>
      {image ? <Link href={`/productDatailes/${product._id}`} aria-label={`View ${product.title}`} className="absolute inset-0"><Image src={image} alt={product.title} fill unoptimized sizes={list ? "160px" : "(max-width: 768px) 50vw, 25vw"} className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]" /></Link> : <div className="flex h-full items-center justify-center text-xs text-[#929b95]">Image unavailable</div>}
      {discount > 0 && <span className="absolute left-2 top-2 rounded bg-[#ef4444] px-1.5 py-1 text-[9px] font-bold text-white">-{discount}%</span>}
      <WishlistButton productId={product._id} productName={product.title} />
      {list && <div className="absolute bottom-2 right-2"><CartButtonCom productId={product._id} disabled={product.quantity < 1} ariaLabel={`Add ${product.title} to cart`} className="flex size-8 items-center justify-center rounded-full bg-[#159b4b] text-lg font-semibold leading-none text-white shadow-sm disabled:opacity-50">+</CartButtonCom></div>}
    </div>
    <div className={`flex min-w-0 flex-1 flex-col ${list ? "py-1 pr-1" : "p-3"}`}>
      <p className="truncate text-[9px] font-medium text-[#7f8c84]">{product.category?.name || "Products"}</p>
      <Link href={`/productDatailes/${product._id}`} className={`mt-1 line-clamp-2 font-medium text-[#28342c] hover:text-[#159447] ${list ? "text-sm sm:text-base" : "min-h-8 text-[11px]"}`}>{product.title}</Link>
      <p className="mt-1 truncate text-[9px] text-[#98a19b]">{product.brand?.name || "FreshCart"}</p>
      <div className="mt-1.5 flex items-center gap-1 text-[9px] text-[#536272]"><span className="flex items-center gap-0.5 text-[#f4b400]"><Star size={11} className="fill-current" />{Number(product.ratingsAverage || 0).toFixed(1)}</span><span>({product.ratingsQuantity || 0})</span></div>
      {list && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#78847d]">{product.description}</p>}
      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <span><span className="block text-xs font-bold text-[#159447]">{money(actualPrice)}</span>{discount > 0 && <span className="text-[9px] text-[#9ba49e] line-through">{money(product.price)}</span>}</span>
        {!list && <CartButtonCom productId={product._id} disabled={product.quantity < 1} ariaLabel={`Add ${product.title} to cart`} className="flex size-8 items-center justify-center rounded-full bg-[#159b4b] text-lg font-semibold leading-none text-white transition hover:bg-[#11833f] disabled:opacity-50">+</CartButtonCom>}
      </div>
    </div>
  </article>;
}

function FilterGroup({ title, items, selected, onToggle }: { title: string; items: { id: string; name: string }[]; selected: string; onToggle: (id: string) => void }) {
  return <section className="border-b border-[#edf0ed] py-4 first:pt-0 last:border-0"><h3 className="mb-2.5 text-xs font-bold text-[#28342c]">{title}</h3><div className="max-h-48 space-y-2 overflow-y-auto pr-1">
    {items.map((item) => <label key={item.id} className="flex cursor-pointer items-center gap-2 text-[11px] text-[#65716a] hover:text-[#159447]"><input type="checkbox" checked={selected === item.id} onChange={() => onToggle(item.id)} className="size-3.5 accent-[#159b4b]" /><span className="truncate">{item.name}</span></label>)}
    {!items.length && <p className="text-[10px] text-[#98a19b]">No filters available</p>}
  </div></section>;
}

export default function SearchResultsPage({ products, categories, brands, query, selectedCategory, selectedBrand, minPrice, maxPrice, sort, loadError }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewMode>("grid");
  const [searchText, setSearchText] = useState(query);
  const [minValue, setMinValue] = useState(minPrice);
  const [maxValue, setMaxValue] = useState(maxPrice);
  const page = Number(searchParams.get("page") || "1");
  const totalPages = Math.max(1, products.metadata?.numberOfPages || 1);
  const resultCount = products.results ?? products.data?.length ?? 0;

  const makeUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    return params.size ? `/search?${params.toString()}` : "/search";
  };
  const toggleFilter = (key: string, id: string) => router.push(makeUrl({ [key]: searchParams.get(key) === id ? null : id, page: null }));
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(makeUrl({ q: searchText.trim() || null, page: null }));
  };
  const submitPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(makeUrl({ min: minValue.trim() || null, max: maxValue.trim() || null, page: null }));
  };
  const clearFilters = () => router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  const filterContent = <>
    <FilterGroup title="Categories" items={categories.map((category) => ({ id: category._id, name: category.name }))} selected={selectedCategory} onToggle={(id) => toggleFilter("category", id)} />
    <section className="border-b border-[#edf0ed] py-4"><h3 className="mb-3 text-xs font-bold text-[#28342c]">Price Range</h3><form onSubmit={submitPrice}>
      <div className="grid grid-cols-2 gap-2"><label className="text-[9px] text-[#7e8982]">Min (EGP)<input type="number" min="0" value={minValue} onChange={(event) => setMinValue(event.target.value)} placeholder="0" className="mt-1 h-9 w-full rounded-md border border-[#e1e7e2] px-2 text-[11px] text-[#344139] outline-none focus:border-[#159b4b]" /></label><label className="text-[9px] text-[#7e8982]">Max (EGP)<input type="number" min="0" value={maxValue} onChange={(event) => setMaxValue(event.target.value)} placeholder="No limit" className="mt-1 h-9 w-full rounded-md border border-[#e1e7e2] px-2 text-[11px] text-[#344139] outline-none focus:border-[#159b4b]" /></label></div>
      <button type="submit" className="mt-2 h-8 w-full rounded-md bg-[#159b4b] text-[10px] font-semibold text-white hover:bg-[#11833f]">Apply Price</button>
      <div className="mt-2 flex flex-wrap gap-1.5">{[{ label: "Under 500", value: "500" }, { label: "Under 1K", value: "1000" }, { label: "Under 5K", value: "5000" }, { label: "Under 10K", value: "10000" }].map((chip) => <button key={chip.value} type="button" onClick={() => { setMaxValue(chip.value); router.push(makeUrl({ max: chip.value, min: null, page: null })); }} className="rounded-full bg-[#f0f2f4] px-2.5 py-1.5 text-[9px] text-[#637068] hover:bg-[#e7f5eb] hover:text-[#159447]">{chip.label}</button>)}</div>
    </form></section>
    <FilterGroup title="Brands" items={brands.map((brand) => ({ id: brand._id, name: brand.name }))} selected={selectedBrand} onToggle={(id) => toggleFilter("brand", id)} />
    <button type="button" onClick={clearFilters} className="mt-3 text-[10px] font-semibold text-[#159447] hover:underline">Clear all filters</button>
  </>;

  return <main className="min-h-[65vh] flex-1 bg-[#fbfcfd] pb-12 text-[#26332b]">
    <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
      <p className="mb-3 text-[10px] text-[#8b9590]"><Link href="/" className="hover:text-[#159447]">Home</Link>&nbsp; / &nbsp;Search Results</p>
      <form onSubmit={submitSearch} role="search" className="mb-5 flex h-10 max-w-[520px] items-center rounded-md border border-[#dfe5e1] bg-white px-3 shadow-[0_1px_4px_rgba(20,38,27,0.025)] focus-within:border-[#159b4b]">
        <Search size={14} className="mr-2 shrink-0 text-[#829087]" /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search for products…" aria-label="Search products" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#a0aaa3]" /><button type="submit" aria-label="Search" className="flex size-7 items-center justify-center rounded bg-[#159b4b] text-white hover:bg-[#11833f]"><Search size={13} /></button>
      </form>

      <div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden rounded-xl border border-[#e8ece9] bg-white p-4 lg:block"><h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={15} className="text-[#159447]" />Filters</h2>{filterContent}</aside>
        <details className="rounded-xl border border-[#e8ece9] bg-white lg:hidden"><summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-xs font-semibold text-[#344139]"><SlidersHorizontal size={14} className="text-[#159447]" />Filters{(selectedCategory || selectedBrand || minPrice || maxPrice) && <span className="ml-auto rounded-full bg-[#eaf8ef] px-2 py-0.5 text-[9px] font-semibold text-[#159447]">Active</span>}</summary><div className="border-t border-[#edf0ed] p-3">{filterContent}</div></details>

        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div><h1 className="text-lg font-bold text-[#202b24]">Search Results</h1><p className="mt-0.5 text-[10px] text-[#7f8b83]">{query ? <>Showing results for <span className="font-semibold text-[#344139]">“{query}”</span> · {resultCount} products</> : `${resultCount} products available`}</p></div>
            <div className="flex items-center gap-3"><div className="flex rounded-md border border-[#e0e6e2] bg-white p-0.5"><button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`flex size-8 items-center justify-center rounded ${view === "grid" ? "bg-[#159b4b] text-white" : "text-[#748078] hover:bg-[#f3f6f4]"}`}><Grid2X2 size={15} /></button><button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={`flex size-8 items-center justify-center rounded ${view === "list" ? "bg-[#159b4b] text-white" : "text-[#748078] hover:bg-[#f3f6f4]"}`}><List size={16} /></button></div>
              <label className="flex items-center gap-2 text-[10px] text-[#65716a]"><span className="hidden sm:inline">Sort by:</span><select value={sort || "relevance"} onChange={(event) => router.push(makeUrl({ sort: event.target.value === "relevance" ? null : event.target.value, page: null }))} className="h-9 rounded-md border border-[#159b4b] bg-white px-2 text-[10px] text-[#344139] outline-none"><option value="relevance">Relevance</option><option value="price">Price: Low to High</option><option value="-price">Price: High to Low</option><option value="-ratingsAverage">Rating: High to Low</option><option value="title">Name: A to Z</option><option value="-title">Name: Z to A</option></select></label>
            </div>
          </div>

          {loadError ? <div role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center text-sm text-[#9e5050]">{loadError}</div> : products.data?.length ? <div className={view === "grid" ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-3"}>{products.data.map((product) => <ProductCard key={product._id} product={product} list={view === "list"} />)}</div> : <div className="rounded-xl border border-[#e5eae6] bg-white px-5 py-14 text-center"><Search size={25} className="mx-auto text-[#adb7b0]" /><h2 className="mt-3 text-sm font-semibold">No products found</h2><p className="mt-1 text-xs text-[#869189]">Try another search term or clear some filters.</p><button type="button" onClick={clearFilters} className="mt-4 text-xs font-semibold text-[#159447] hover:underline">Clear filters</button></div>}

          {!loadError && totalPages > 1 && <nav aria-label="Search results pages" className="mt-6 flex flex-wrap items-center justify-center gap-1.5"><button type="button" disabled={page <= 1} onClick={() => router.push(makeUrl({ page: String(page - 1) }))} aria-label="Previous page" className="flex size-8 items-center justify-center rounded-md border border-[#e1e7e2] bg-white text-[#66736a] disabled:opacity-40"><ArrowLeft size={13} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) => totalPages <= 7 || pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1).map((pageNumber, index, visible) => <span key={pageNumber} className="contents">{index > 0 && pageNumber - visible[index - 1] > 1 && <span className="px-1 text-xs text-[#8a958e]">…</span>}<button type="button" aria-current={pageNumber === page ? "page" : undefined} onClick={() => router.push(makeUrl({ page: pageNumber === 1 ? null : String(pageNumber) }))} className={`flex size-8 items-center justify-center rounded-md text-xs ${pageNumber === page ? "bg-[#159b4b] font-semibold text-white" : "border border-[#e1e7e2] bg-white text-[#66736a] hover:border-[#159b4b] hover:text-[#159447]"}`}>{pageNumber}</button></span>)}<button type="button" disabled={page >= totalPages} onClick={() => router.push(makeUrl({ page: String(page + 1) }))} aria-label="Next page" className="flex size-8 items-center justify-center rounded-md border border-[#e1e7e2] bg-white text-[#66736a] disabled:opacity-40"><ArrowRight size={13} /></button></nav>}
        </section>
      </div>
    </div>
  </main>;
}
