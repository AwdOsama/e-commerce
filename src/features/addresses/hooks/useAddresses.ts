"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAddress, addressesQueryKey, getAddresses, removeAddress, replaceAddress } from "../apis/addresses.api";
import type { AddressFormValues } from "../schema/address.schema";

export function useAddressesQuery() {
  return useQuery({ queryKey: addressesQueryKey, queryFn: getAddresses, retry: false, refetchOnMount: "always", refetchOnWindowFocus: true });
}

function useAddressMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressesQueryKey, refetchType: "all" }),
    onError: () => queryClient.invalidateQueries({ queryKey: addressesQueryKey, refetchType: "all" }),
  });
}

export function useAddAddress() {
  return useAddressMutation((data: AddressFormValues) => addAddress(data));
}

export function useRemoveAddress() {
  return useAddressMutation((addressId: string) => removeAddress(addressId));
}

export function useReplaceAddress() {
  return useAddressMutation((variables: { addressId: string; data: AddressFormValues }) => replaceAddress(variables));
}
