import { NextResponse, type NextRequest } from "next/server";
import { forwardReviewMutation } from "@/src/features/reviews/apis/reviews.server";
import { reviewSchema } from "@/src/features/reviews/schema/review.schema";

type ReviewContext = { params: Promise<{ reviewId: string }> };

export async function PUT(request: NextRequest, context: ReviewContext) {
  const { reviewId } = await context.params;
  if (!reviewId.trim()) return NextResponse.json({ message: "A review id is required." }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid review details." }, { status: 400 }); }
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid review details." }, { status: 400 });
  return forwardReviewMutation(request, reviewId, "PUT", parsed.data);
}

export async function DELETE(request: NextRequest, context: ReviewContext) {
  const { reviewId } = await context.params;
  if (!reviewId.trim()) return NextResponse.json({ message: "A review id is required." }, { status: 400 });
  return forwardReviewMutation(request, reviewId, "DELETE");
}
