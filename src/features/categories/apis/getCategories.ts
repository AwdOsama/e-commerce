import type { Category } from "../../Products/interfaces/producy.inter";


export async function getCategory():Promise<Category[]> {
  const response = await fetch(`${process.env.PUBLIC_API}/categories`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);

  const result: { data?: Category[] } = await response.json();
  return result.data ?? [];
}
