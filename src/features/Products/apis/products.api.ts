
import { ProductRes } from "../interfaces/producy.inter";

export interface ProductQueryOptions {
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(categoryId?: string, brandId?: string, keyword?: string, options: ProductQueryOptions = {}):Promise<ProductRes> {
  try {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (brandId) params.set("brand", brandId);
    if (keyword) params.set("keyword", keyword);
    if (typeof options.minPrice === "number") params.set("price[gte]", String(options.minPrice));
    if (typeof options.maxPrice === "number") params.set("price[lte]", String(options.maxPrice));
    if (options.sort && options.sort !== "relevance") params.set("sort", options.sort);
    if (options.page && options.page > 1) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.size ? `?${params.toString()}` : "";
    const response = await fetch(`${process.env.PUBLIC_API}/products${query}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("faild to fetch" + response.statusText);
    return response.json();
  } catch (error) {
    throw error;
  }
}
