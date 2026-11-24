"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductToCart,
  cartQueryKey,
  clearCart,
  getCart,
  removeCartItem,
  updateCartProductQuantity,
} from "../apis/cart.api";
import type { CartResponse } from "../interfaces/cart.interface";

export function useCartQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
    enabled: options.enabled ?? true,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

function useCartMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<CartResponse | null>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      if (Array.isArray(response?.payload?.data?.products)) {
        queryClient.setQueryData(cartQueryKey, response);
      }
      await queryClient.invalidateQueries({
        queryKey: cartQueryKey,
        refetchType: "all",
      });
    },
    onError: () => queryClient.invalidateQueries({
      queryKey: cartQueryKey,
      refetchType: "all",
    }),
  });
}

export function useAddProductToCart() {
  return useCartMutation(addProductToCart);
}

export function useUpdateCartProductQuantity() {
  return useCartMutation(({ productId, count }: { productId: string; count: number }) =>
    updateCartProductQuantity(productId, count),
  );
}

export function useRemoveCartItem() {
  return useCartMutation((productId: string) => removeCartItem(productId));
}

export function useClearCart() {
  return useCartMutation(() => clearCart());
}
