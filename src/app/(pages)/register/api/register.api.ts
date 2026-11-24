"use server";
import { regitsreSchemeType } from "../schema/register.schema";

export async function signUp(data: regitsreSchemeType) {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "We couldn't create your account. Please try again.");
  }

  return true;
}
