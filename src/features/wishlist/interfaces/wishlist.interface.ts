import type { ProductInterface } from "@/src/features/Products/interfaces/producy.inter";

export interface WishlistPayload {
  status?: string;
  count?: number;
  data: ProductInterface[];
}

export interface WishlistResponse {
  payload: WishlistPayload;
}
