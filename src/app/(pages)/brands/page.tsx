import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { getBrands } from "@/src/features/brands/apis/brands.api";

export const metadata: Metadata = { title: "Brands" };

export default function BrandsPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-[65vh] w-full max-w-[1180px] px-4 pt-8" aria-label="Loading brands" aria-busy="true">
      <div className="mb-5 h-20 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, index) => <div key={index} className="min-h-32 animate-pulse rounded-lg border border-border bg-card" />)}
      </div>
    </main>}>
      <BrandsContent />
    </Suspense>
  );
}

async function BrandsContent() {
  let brands: Awaited<ReturnType<typeof getBrands>> = [];
  let failed = false;
  try {
    brands = await getBrands();
  } catch {
    failed = true;
  }

  return (
    <main className="min-h-[65vh] flex-1 bg-[#fafbfc] pb-10 text-[#1c2631]">
      <div className="mx-auto max-w-[1180px] px-4 pt-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-[10px] text-[#8b929a]"><Link href="/" className="hover:text-[#8139ed]">Home</Link>&nbsp; / &nbsp;Brands</p>
        <header className="overflow-hidden rounded-xl bg-gradient-to-r from-[#7c2cf2] via-[#9148fa] to-[#b264fa] px-5 py-6 text-white shadow-sm sm:px-7 sm:py-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/20"><Award size={21} /></span>
            <div><h1 className="text-xl font-bold sm:text-2xl">Top Brands</h1><p className="mt-1 text-[11px] text-white/85 sm:text-xs">Shop from your favorite brands</p></div>
          </div>
        </header>

        {failed ? (
          <section role="alert" className="mt-5 rounded-xl border border-[#e8eaf0] bg-white p-8 text-center">
            <p className="text-sm font-semibold">Brands are unavailable right now.</p>
            <p className="mt-1 text-xs text-[#818a94]">Please refresh the page in a moment.</p>
          </section>
        ) : brands.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((brand) => (
              <li key={brand._id}>
                <Link href={`/search?brand=${encodeURIComponent(brand._id)}`} className="group flex min-h-[116px] flex-col items-center justify-center rounded-lg border border-[#edf0f2] bg-white px-3 py-4 text-center shadow-[0_1px_5px_rgba(28,38,49,0.025)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d9c4fa] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d40ef] sm:min-h-[130px]">
                  <span className="relative mb-2 flex h-12 w-full items-center justify-center sm:h-14">
                    {brand.image ? <Image src={brand.image} alt={`${brand.name} logo`} fill unoptimized sizes="(max-width: 640px) 40vw, 150px" className="object-contain p-2 transition-transform duration-200 group-hover:scale-105" /> : <span className="line-clamp-2 text-sm font-bold tracking-tight text-[#28333d]">{brand.name}</span>}
                  </span>
                  <span className="text-[10px] font-medium text-[#74808a] group-hover:text-[#8139ed] sm:text-[11px]">{brand.name}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-[#9148fa] opacity-0 transition-opacity group-hover:opacity-100">Shop brand <ArrowRight size={10} /></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <section className="mt-5 rounded-xl border border-[#e8eaf0] bg-white p-8 text-center text-sm text-[#818a94]">No brands are available right now.</section>
        )}
      </div>
    </main>
  );
}
