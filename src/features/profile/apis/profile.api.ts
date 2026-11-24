import type { ProfileFormValues, ChangePasswordFormValues } from "../schema/profile.schema";

export type Profile = ProfileFormValues & { id?: string; role?: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { "Content-Type": "application/json", ...init?.headers } });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || result?.payload?.message || "Something went wrong. Please try again.");
  return result as T;
}

export async function getProfile(): Promise<Profile> {
  const result = await request<{ payload: unknown }>("/api/profile");
  const payload = result.payload;
  if (!payload || typeof payload !== "object") throw new Error("The profile response has an unexpected format.");
  const record = payload as Record<string, unknown>;
  const nested = record.user ?? record.data ?? payload;
  if (!nested || typeof nested !== "object") throw new Error("The profile response has an unexpected format.");
  const user = nested as Record<string, unknown>;
  if (typeof user.name !== "string" || typeof user.email !== "string") throw new Error("The profile response has an unexpected format.");
  return { name: user.name, email: user.email, phone: typeof user.phone === "string" ? user.phone : "", id: typeof user._id === "string" ? user._id : typeof user.id === "string" ? user.id : undefined, role: typeof user.role === "string" ? user.role : undefined };
}

export function updateProfile(data: ProfileFormValues) {
  return request<{ payload: unknown }>("/api/profile", { method: "PUT", body: JSON.stringify(data) });
}

export function changePassword(data: ChangePasswordFormValues) {
  return request<{ payload: unknown }>("/api/profile/password", { method: "PUT", body: JSON.stringify(data) });
}
