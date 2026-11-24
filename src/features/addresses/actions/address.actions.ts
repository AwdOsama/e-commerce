"use server";

import { getServerSession } from "next-auth/next";
import { authOP } from "@/Next-auth/next-auth";
import { requestAddress } from "../apis/address.server";
import type { AddressFormValues } from "../schema/address.schema";

async function getAccessToken() {
  const session = await getServerSession(authOP);
  const token = session?.user?.accessToken;
  if (!token) throw new Error("Unauthorized");
  return token;
}

function ensureSuccess(result: { status: number; data: unknown }, fallback: string) {
  if (result.status < 200 || result.status >= 300) {
    const payload = result.data as { message?: string; errors?: { msg?: string }[] } | null;
    throw new Error(payload?.message || payload?.errors?.[0]?.msg || fallback);
  }
}

export async function addAddressAction(data: AddressFormValues) {
  const token = await getAccessToken();
  const result = await requestAddress(token, { method: "POST", body: data });
  ensureSuccess(result, "Unable to save this address.");
  return result.data;
}

export async function removeAddressAction(addressId: string) {
  if (!addressId.trim()) throw new Error("An address ID is required.");
  const token = await getAccessToken();
  const result = await requestAddress(token, { method: "DELETE", path: `/${encodeURIComponent(addressId)}` });
  ensureSuccess(result, "Unable to remove this address.");
  return result.data;
}

export async function replaceAddressAction(addressId: string, data: AddressFormValues) {
  if (!addressId.trim()) throw new Error("An address ID is required.");
  const token = await getAccessToken();
  const created = await requestAddress(token, { method: "POST", body: data });
  ensureSuccess(created, "Unable to save the updated address.");
  const createdData = created.data as { data?: { _id?: string }; _id?: string } | null;
  const newId = createdData?.data?._id || createdData?._id;
  const removed = await requestAddress(token, { method: "DELETE", path: `/${encodeURIComponent(addressId)}` });
  if (removed.status < 200 || removed.status >= 300) {
    if (newId) await requestAddress(token, { method: "DELETE", path: `/${encodeURIComponent(newId)}` }).catch(() => null);
    ensureSuccess(removed, "Unable to replace this address. Your original address is still saved.");
  }
  return created.data;
}
