import type { ProductReview, ProductReviewsResult } from "../interfaces/review.interface";
import type { ReviewFormValues } from "../schema/review.schema";

export const productReviewsQueryKey = (productId: string) => ["product-reviews", productId] as const;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { "Content-Type": "application/json", ...init?.headers } });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.payload?.message || "The review request could not be completed.");
  return payload as T;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function unwrapReviews(value: unknown): { rows?: unknown[]; total?: number } {
  if (Array.isArray(value)) return { rows: value };
  const record = asRecord(value);
  if (!record) return {};
  if (Array.isArray(record.data)) return { rows: record.data, total: typeof record.results === "number" ? record.results : undefined };
  for (const key of ["payload", "data", "reviews"]) {
    const found = unwrapReviews(record[key]);
    if (found.rows) return { rows: found.rows, total: found.total ?? (typeof record.results === "number" ? record.results : undefined) };
  }
  return {};
}

function normalizeReview(value: unknown): ProductReview | undefined {
  const source = asRecord(value);
  if (!source || typeof source._id !== "string" || typeof source.review !== "string") return undefined;
  const rawUser = asRecord(source.user ?? source.owner ?? source.createdBy);
  const rawUserId = typeof source.user === "string"
    ? source.user
    : typeof source.userId === "string"
      ? source.userId
      : typeof rawUser?._id === "string"
        ? rawUser._id
        : typeof rawUser?.id === "string"
          ? rawUser.id
          : typeof rawUser?.userId === "string" ? rawUser.userId : undefined;
  const rating = Number(source.rating);
  return {
    _id: source._id,
    review: source.review,
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0,
    ...(rawUser || rawUserId ? { user: {
      ...(rawUserId ? { _id: rawUserId } : {}),
      ...(typeof rawUser?.name === "string" ? { name: rawUser.name } : {}),
      ...(typeof rawUser?.email === "string" ? { email: rawUser.email } : {}),
    } } : {}),
    ...(typeof source.createdAt === "string" ? { createdAt: source.createdAt } : {}),
  };
}

export async function getProductReviews(productId: string): Promise<ProductReviewsResult> {
  const response = await request<{ payload?: unknown }>(`/api/products/${encodeURIComponent(productId)}/reviews`);
  const unwrapped = unwrapReviews(response.payload);
  if (!unwrapped.rows) throw new Error("The reviews response has an unexpected format.");
  const reviews = unwrapped.rows.map(normalizeReview).filter((review): review is ProductReview => Boolean(review));
  return { reviews, total: unwrapped.total ?? reviews.length };
}

export function createReview(productId: string, data: ReviewFormValues) {
  return request(`/api/products/${encodeURIComponent(productId)}/reviews`, { method: "POST", body: JSON.stringify(data) });
}

export function updateReview(reviewId: string, data: ReviewFormValues) {
  return request(`/api/reviews/${encodeURIComponent(reviewId)}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteReview(reviewId: string) {
  const response = await fetch(`/api/reviews/${encodeURIComponent(reviewId)}`, { method: "DELETE", cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || "Unable to delete this review.");
  }
}
