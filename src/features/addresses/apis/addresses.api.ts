import type { AddressFormValues } from "../schema/address.schema";
import type { AddressResponse, UserAddress } from "../interfaces/address.interface";
import { addAddressAction, removeAddressAction, replaceAddressAction } from "../actions/address.actions";

export const addressesQueryKey = ["addresses"] as const;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { "Content-Type": "application/json", ...init?.headers } });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || result?.payload?.message || "Unable to load your addresses.");
  return result as T;
}

export async function getAddresses(): Promise<AddressResponse> {
  const response = await request<{ payload: { data?: UserAddress[] } | UserAddress[] }>("/api/addresses");
  const data = Array.isArray(response.payload) ? response.payload : response.payload?.data;
  if (!Array.isArray(data)) throw new Error("The addresses response has an unexpected format.");
  return { payload: { data } };
}

export async function getAddress(addressId: string): Promise<UserAddress> {
  const response = await request<{ payload: { data?: UserAddress } | UserAddress }>(`/api/addresses/${encodeURIComponent(addressId)}`);
  const payload: unknown = response.payload;
  if (!payload || typeof payload !== "object") throw new Error("The address response has an unexpected format.");
  const record = payload as Record<string, unknown>;
  const address = record.data && typeof record.data === "object" ? record.data as Record<string, unknown> : record;
  if (typeof address._id !== "string" || typeof address.name !== "string" || typeof address.details !== "string" || typeof address.phone !== "string" || typeof address.city !== "string") throw new Error("The address response has an unexpected format.");
  return address as unknown as UserAddress;
}

export const addAddress = (data: AddressFormValues) => addAddressAction(data);
export const removeAddress = (addressId: string) => removeAddressAction(addressId);
export const replaceAddress = ({ addressId, data }: { addressId: string; data: AddressFormValues }) => replaceAddressAction(addressId, data);
