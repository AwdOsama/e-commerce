"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, LoaderCircle, Search, Tag } from "lucide-react";

type SearchItem = { id: string; name: string; image?: string; price?: number; brand?: string };
type SearchResults = { products: SearchItem[]; categories: SearchItem[]; brands: SearchItem[] };

async function searchStore(keyword: string): Promise<SearchResults> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`, { cache: "no-store" });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || "Search is temporarily unavailable.");
  return result as SearchResults;
}

function ResultImage({ src, alt }: { src?: string; alt: string }) {
  return <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f3f6f4] text-[#8a958e]">
    {src ? <Image src={src} alt={alt} fill unoptimized sizes="36px" className="object-contain p-1" /> : <Search size={14} />}
  </span>;
}

function ResultGroup({ title, icon, items, hrefFor, onSelect, showPrice = false }: {
  title: string;
  icon: React.ReactNode;
  items: SearchItem[];
  hrefFor: (item: SearchItem) => string;
  onSelect: () => void;
  showPrice?: boolean;
}) {
  if (!items.length) return null;
  return <section className="py-1.5">
    <h3 className="flex items-center gap-2 px-3 pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a958e]">{icon}{title}</h3>
    <ul>{items.map((item) => <li key={item.id}>
      <Link role="option" aria-selected="false" href={hrefFor(item)} onClick={onSelect} className="flex items-center gap-2.5 px-3 py-2 transition hover:bg-[#f3faf5]">
        <ResultImage src={item.image} alt={item.name} />
        <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium text-[#28342c]">{item.name}</span>{item.brand && <span className="block truncate text-[9px] text-[#929c95]">{item.brand}</span>}</span>
        {showPrice && typeof item.price === "number" && <span className="shrink-0 text-[10px] font-semibold text-[#159447]">{new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(item.price)} EGP</span>}
      </Link>
    </li>)}</ul>
  </section>;
}

export default function NavbarSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const closeIfOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeIfOutside);
    return () => document.removeEventListener("pointerdown", closeIfOutside);
  }, []);

  const searchQuery = useQuery({
    queryKey: ["navbar-search", debouncedValue],
    queryFn: () => searchStore(debouncedValue),
    enabled: open && debouncedValue.length >= 2,
    staleTime: 30_000,
    retry: false,
  });
  const results = searchQuery.data;
  const hasResults = Boolean(results && (results.products.length || results.categories.length || results.brands.length));
  const showPanel = open && value.trim().length >= 2;

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = value.trim();
    if (!keyword) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };
  const closePanel = () => setOpen(false);

  return <div ref={rootRef} className={`relative ${className}`}>
    <form onSubmit={submitSearch} role="search" className="flex h-10 min-w-0 items-center rounded-full border border-slate-200 bg-slate-50/70 pl-4 focus-within:border-[#8dd3aa] focus-within:ring-2 focus-within:ring-[#159b4b]/10">
      <input
        aria-label="Search products, categories, or brands"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showPanel}
        aria-controls={showPanel ? "navbar-search-results" : undefined}
        autoComplete="off"
        value={value}
        onChange={(event) => { setValue(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
        placeholder="Search products, brands and more..."
        className="h-full min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button type="submit" aria-label="Search" className="mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00ad73] text-white transition hover:bg-[#009b67]"><Search aria-hidden="true" size={15} /></button>
    </form>

    {showPanel && <div id="navbar-search-results" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] max-h-[min(72vh,480px)] overflow-y-auto rounded-xl border border-[#e6ece8] bg-white py-1 shadow-[0_12px_36px_rgba(20,38,27,0.16)]">
      {searchQuery.isFetching || debouncedValue !== value.trim() ? <div role="status" className="flex items-center gap-2 px-4 py-4 text-xs text-[#7c8980]"><LoaderCircle size={14} className="animate-spin text-[#159447]" />Searching…</div> : searchQuery.isError ? <p role="alert" className="px-4 py-4 text-xs text-[#a45a5a]">{searchQuery.error.message}</p> : hasResults ? <>
        <ResultGroup title="Products" icon={<Search size={11} />} items={results?.products ?? []} showPrice hrefFor={(item) => `/productDatailes/${encodeURIComponent(item.id)}`} onSelect={closePanel} />
        <ResultGroup title="Categories" icon={<Building2 size={11} />} items={results?.categories ?? []} hrefFor={(item) => `/search?category=${encodeURIComponent(item.id)}`} onSelect={closePanel} />
        <ResultGroup title="Brands" icon={<Tag size={11} />} items={results?.brands ?? []} hrefFor={(item) => `/search?brand=${encodeURIComponent(item.id)}`} onSelect={closePanel} />
        <Link href={`/search?q=${encodeURIComponent(value.trim())}`} onClick={closePanel} className="flex items-center justify-between border-t border-[#edf1ee] px-3 py-2.5 text-[10px] font-semibold text-[#159447] hover:bg-[#f3faf5]">See all results for “{value.trim()}” <ArrowRight size={12} /></Link>
      </> : searchQuery.isSuccess ? <p className="px-4 py-4 text-xs text-[#7c8980]">No products, categories, or brands found.</p> : <div className="px-4 py-4 text-xs text-[#7c8980]">Type to search products, categories, and brands.</div>}
    </div>}
  </div>;
}
