import { NextResponse, type NextRequest } from "next/server";
import { forwardProductReviews, requestProductReviews } from "@/src/features/reviews/apis/reviews.server";
import { reviewSchema } from "@/src/features/reviews/schema/review.schema";

type ProductReviewsContext = { params: Promise<{ productId: string }> };

export async function GET(_request: NextRequest, context: ProductReviewsContext) {
  const { productId } = await context.params;
  if (!productId.trim()) return NextResponse.json({ message: "A product id is required." }, { status: 400 });
  try {
    const result = await requestProductReviews(productId);
    return NextResponse.json({ payload: result.data }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to connect to the reviews service." }, { status: 502 });
  }
}

export async function POST(request: NextRequest, context: ProductReviewsContext) {
  const { productId } = await context.params;
  if (!productId.trim()) return NextResponse.json({ message: "A product id is required." }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid review details." }, { status: 400 }); }
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid review details." }, { status: 400 });
  return forwardProductReviews(request, productId, "POST", parsed.data);
}
