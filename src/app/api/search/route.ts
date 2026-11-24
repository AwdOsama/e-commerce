import { NextResponse, type NextRequest } from "next/server";

type SearchItem = { id: string; name: string; image?: string; price?: number; brand?: string };

async function loadResults(url: string): Promise<unknown[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Search source returned ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object") return [];
  const data = (body as Record<string, unknown>).data;
  return Array.isArray(data) ? data : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function asItem(value: unknown, kind: "product" | "brand" | "category"): SearchItem | null {
  const item = asRecord(value);
  if (typeof item._id !== "string") return null;
  const name = kind === "product" ? item.title : item.name;
  if (typeof name !== "string") return null;
  const image = kind === "product" ? item.imageCover : item.image;
  const brand = asRecord(item.brand).name;
  return {
    id: item._id,
    name,
    ...(typeof image === "string" ? { image } : {}),
    ...(kind === "product" && typeof item.priceAfterDiscount === "number" ? { price: item.priceAfterDiscount } : kind === "product" && typeof item.price === "number" ? { price: item.price } : {}),
    ...(typeof brand === "string" ? { brand } : {}),
  };
}

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (keyword.length < 2) return NextResponse.json({ products: [], categories: [], brands: [] }, { headers: { "Cache-Control": "no-store" } });

  const apiBase = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiBase) return NextResponse.json({ message: "Search is not configured." }, { status: 500 });
  const query = new URLSearchParams({ keyword, limit: "5" }).toString();
  const results = await Promise.allSettled([
    loadResults(`${apiBase}/products?${query}`),
    loadResults(`${apiBase}/categories?${query}`),
    loadResults(`${apiBase}/brands?${query}`),
  ]);
  if (results.every((result) => result.status === "rejected")) {
    return NextResponse.json({ message: "Unable to search right now." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  const [products, categories, brands] = results.map((result) => result.status === "fulfilled" ? result.value : []);
  return NextResponse.json({
    products: products.flatMap((item) => { const parsed = asItem(item, "product"); return parsed ? [parsed] : []; }),
    categories: categories.flatMap((item) => { const parsed = asItem(item, "category"); return parsed ? [parsed] : []; }),
    brands: brands.flatMap((item) => { const parsed = asItem(item, "brand"); return parsed ? [parsed] : []; }),
  }, { headers: { "Cache-Control": "no-store" } });
}
