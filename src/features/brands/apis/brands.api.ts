import "server-only";

import type { Brand } from "@/src/features/Products/interfaces/producy.inter";

export async function getBrands(): Promise<Brand[]> {
  const apiBase = process.env.PUBLIC_API?.replace(/\/$/, "");
  if (!apiBase) throw new Error("Brands service is not configured.");
  const response = await fetch(`${apiBase}/brands?limit=100`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load brands.");
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object") throw new Error("The brands response has an unexpected format.");
  const record = result as Record<string, unknown>;
  const rows = Array.isArray(record.data) ? record.data : [];
  return rows.flatMap((value): Brand[] => {
    if (!value || typeof value !== "object") return [];
    const brand = value as Record<string, unknown>;
    if (typeof brand._id !== "string" || typeof brand.name !== "string") return [];
    return [{
      _id: brand._id,
      name: brand.name,
      slug: typeof brand.slug === "string" ? brand.slug : brand._id,
      image: typeof brand.image === "string" ? brand.image : "",
    }];
  });
}
