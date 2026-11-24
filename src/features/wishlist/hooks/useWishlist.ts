"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, getWishlist, removeFromWishlist, wishlistQueryKey } from "../apis/wishlist.api";
import type { WishlistResponse } from "../interfaces/wishlist.interface";

export function useWishlistQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: wishlistQueryKey,
    queryFn: getWishlist,
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

function useWishlistMutation(mutationFn: (productId: string) => Promise<WishlistResponse | null>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      if (Array.isArray(response?.payload?.data)) queryClient.setQueryData(wishlistQueryKey, response);
      await queryClient.invalidateQueries({ queryKey: wishlistQueryKey, refetchType: "all" });
    },
    onError: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKey, refetchType: "all" }),
  });
}

export function useAddToWishlist() {
  return useWishlistMutation(addToWishlist);
}

export function useRemoveFromWishlist() {
  return useWishlistMutation(removeFromWishlist);
}
