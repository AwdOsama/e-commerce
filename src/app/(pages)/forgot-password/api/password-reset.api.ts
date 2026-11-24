const API = "https://ecommerce.routemisr.com/api/v1/auth";

async function request(path: string, method: "POST" | "PUT", body: Record<string, string>) {
  const response = await fetch(`${API}/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || "Something went wrong. Please try again.");
  return result;
}

export function requestResetCode(email: string) {
  return request("forgotPasswords", "POST", { email });
}

export function verifyResetCode(resetCode: string) {
  return request("verifyResetCode", "POST", { resetCode });
}

export function resetPassword(email: string, newPassword: string) {
  return request("resetPassword", "PUT", { email, newPassword });
}
