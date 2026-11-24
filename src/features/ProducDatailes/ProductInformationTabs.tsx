"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Check, PackageCheck, RotateCcw, ShieldCheck, Star, Truck, X } from "lucide-react";
import type { ProductInterface } from "../Products/interfaces/producy.inter";
import { createReview, deleteReview, getProductReviews, productReviewsQueryKey, updateReview } from "../reviews/apis/reviews.api";
import type { ProductReview } from "../reviews/interfaces/review.interface";
import { reviewSchema, type ReviewFormValues } from "../reviews/schema/review.schema";
import { getProfile } from "../profile/apis/profile.api";

type TabId = "details" | "reviews" | "shipping";
type ComposerState = { mode: "create" } | { mode: "edit"; review: ProductReview };
const sessionQueryKey = ["auth-session"] as const;

function ReviewComposer({
  initial,
  busy,
  onCancel,
  onSubmit,
}: {
  initial?: ProductReview;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (values: ReviewFormValues) => void;
}) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: initial?.review ?? "", rating: initial?.rating ?? 5 },
  });
  const rating = useWatch({ control: form.control, name: "rating" });
  return <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 rounded-xl border border-[#e7ece8] bg-[#fbfcfb] p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">{initial ? "Edit your review" : "Write a Review"}</h3><button type="button" onClick={onCancel} aria-label="Close review form" className="rounded-md p-1 text-[#8a958e] hover:bg-[#eef3ef]"><X size={16} /></button></div>
    <fieldset className="mt-3"><legend className="text-xs font-medium text-[#68756c]">Your rating</legend><div className="mt-1 flex items-center gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} star${value > 1 ? "s" : ""}`} aria-pressed={rating === value} onClick={() => form.setValue("rating", value, { shouldValidate: true })} className="rounded p-0.5 focus-visible:outline-2 focus-visible:outline-[#159b4b]"><Star size={22} className={value <= rating ? "fill-[#f5b800] text-[#f5b800]" : "text-[#cbd2cd]"} /></button>)}</div>{form.formState.errors.rating?.message && <p role="alert" className="mt-1 text-[10px] text-red-600">{form.formState.errors.rating.message}</p>}</fieldset>
    <label className="mt-3 block text-xs font-medium text-[#68756c]">Your review<textarea {...form.register("review")} rows={4} placeholder="Share your experience with this product…" className="mt-1.5 w-full resize-y rounded-lg border border-[#dfe6e1] bg-white px-3 py-2.5 text-sm text-[#26332b] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#20b85b] focus:ring-2 focus:ring-[#20b85b]/10" /></label>
    {form.formState.errors.review?.message && <p role="alert" className="mt-1 text-[10px] text-red-600">{form.formState.errors.review.message}</p>}
    <div className="mt-3 flex justify-end gap-2"><button type="button" disabled={busy} onClick={onCancel} className="rounded-lg border border-[#dfe6e1] px-4 py-2 text-xs font-semibold text-[#68756c] hover:bg-white disabled:opacity-50">Cancel</button><button type="submit" disabled={busy} className="rounded-lg bg-[#159b4b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#11833f] disabled:cursor-wait disabled:opacity-60">{busy ? "Saving…" : initial ? "Save Changes" : "Submit Review"}</button></div>
  </form>;
}

function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} className={star <= Math.round(rating) ? "fill-[#f5b800] text-[#f5b800]" : "text-[#cbd2cd]"} />)}</span>;
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-EG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default function ProductInformationTabs({ product }: { product: ProductInterface }) {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const reviewsQuery = useQuery({ queryKey: productReviewsQueryKey(product._id), queryFn: () => getProductReviews(product._id), retry: false, refetchOnMount: "always" });
  const sessionQuery = useQuery({ queryKey: sessionQueryKey, queryFn: () => getSession(), retry: false });
  const sessionUserId = sessionQuery.data?.user?.id;
  const hasSessionUserId = Boolean(sessionUserId && /^[a-f\d]{24}$/i.test(sessionUserId));
  const currentProfileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile, enabled: Boolean(sessionQuery.data?.user && !hasSessionUserId), retry: false });
  const reviews = reviewsQuery.data?.reviews ?? [];
  const reviewTotal = reviewsQuery.data?.total ?? product.ratingsQuantity ?? 0;
  const currentUserId = (hasSessionUserId ? sessionUserId : undefined) ?? currentProfileQuery.data?.id;
  const currentEmail = sessionQuery.data?.user?.email?.toLowerCase();
  const currentName = sessionQuery.data?.user?.name?.trim().toLowerCase();
  const ownedReview = (review: ProductReview) => Boolean(
    (currentUserId && review.user?._id === currentUserId) ||
    (currentEmail && review.user?.email?.toLowerCase() === currentEmail) ||
    (!review.user?._id && !review.user?.email && currentName && review.user?.name?.trim().toLowerCase() === currentName),
  );

  const invalidateReviews = async () => queryClient.invalidateQueries({ queryKey: productReviewsQueryKey(product._id), refetchType: "all" });
  const createMutation = useMutation({
    mutationFn: (values: ReviewFormValues) => createReview(product._id, values),
    onSuccess: async () => { await invalidateReviews(); router.refresh(); setComposer(null); toast.success("Your review has been added."); },
    onError: (error: Error) => toast.error(error.message),
  });
  const updateMutation = useMutation({
    mutationFn: ({ reviewId, values }: { reviewId: string; values: ReviewFormValues }) => updateReview(reviewId, values),
    onSuccess: async () => { await invalidateReviews(); router.refresh(); setComposer(null); toast.success("Your review has been updated."); },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => { await invalidateReviews(); router.refresh(); setConfirmDeleteId(null); toast.success("Your review has been deleted."); },
    onError: (error: Error) => toast.error(error.message),
  });

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : Number(product.ratingsAverage) || 0;
  const histogram = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: reviews.filter((review) => review.rating === rating).length }));
  const loggedIn = Boolean(sessionQuery.data?.user);
  const submitReview = (values: ReviewFormValues) => {
    if (composer?.mode === "edit") updateMutation.mutate({ reviewId: composer.review._id, values });
    else createMutation.mutate(values);
  };
  const mutationBusy = createMutation.isPending || updateMutation.isPending;

  return <section className="mt-8 overflow-hidden rounded-xl border border-[#e8ece9] bg-white shadow-[0_2px_8px_rgba(25,52,37,0.03)] sm:mt-10">
    <div role="tablist" aria-label="Product information" className="flex overflow-x-auto border-b border-[#e4e9e5]">
      <TabButton selected={activeTab === "details"} onClick={() => setActiveTab("details")} icon={<PackageCheck size={15} />}>Product Details</TabButton>
      <TabButton selected={activeTab === "reviews"} onClick={() => setActiveTab("reviews")} icon={<Star size={15} />}>Reviews ({reviewTotal})</TabButton>
      <TabButton selected={activeTab === "shipping"} onClick={() => setActiveTab("shipping")} icon={<Truck size={15} />}>Shipping &amp; Returns</TabButton>
    </div>

    {activeTab === "details" && <div role="tabpanel" className="p-4 sm:p-6">
      <h2 className="text-base font-semibold text-[#17212b]">About this Product</h2>
      <p className="mt-2 text-sm leading-6 text-[#536272]">{product.description || "Product details will be updated soon."}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <section className="rounded-lg bg-[#f7f8f9] p-4"><h3 className="text-sm font-medium">Product Information</h3><dl className="mt-3 space-y-2 text-xs">
          <InfoRow label="Category" value={product.category?.name} />
          <InfoRow label="Subcategory" value={product.subcategory?.map((item) => item.name).filter(Boolean).join(", ")} />
          <InfoRow label="Brand" value={product.brand?.name} />
          <InfoRow label="Items Sold" value={`${(Number(product.sold) || 0).toLocaleString("en-EG")}+ sold`} />
        </dl></section>
        <section className="rounded-lg bg-[#f7f8f9] p-4"><h3 className="text-sm font-medium">Key Features</h3><ul className="mt-3 space-y-2.5 text-xs text-[#536272]">
          {["Premium Quality Product", "100% Authentic Guarantee", "Fast & Secure Packaging", "Quality Tested"].map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={14} className="text-[#16a34a]" />{feature}</li>)}
        </ul></section>
      </div>
    </div>}

    {activeTab === "reviews" && <div role="tabpanel" className="p-4 sm:p-6">
      {reviewsQuery.isPending ? <div role="status" className="py-12 text-center text-sm text-[#7d8981]">Loading customer reviews…</div> : reviewsQuery.isError ? <div role="alert" className="rounded-lg border border-red-100 bg-red-50/40 p-5 text-center"><p className="text-sm font-medium text-[#6f3d3d]">Could not load reviews.</p><button type="button" onClick={() => void reviewsQuery.refetch()} className="mt-2 text-xs font-semibold text-[#159447] hover:underline">Try again</button></div> : <>
        <div className="grid items-center gap-5 border-b border-[#e5e9e6] pb-5 md:grid-cols-[190px_minmax(0,1fr)]">
          <div className="text-center"><p className="text-4xl font-bold text-[#17212b]">{average.toFixed(1)}</p><div className="mt-2 flex justify-center"><RatingStars rating={average} size={19} /></div><p className="mt-2 text-xs text-[#718091]">Based on {reviewTotal} {reviewTotal === 1 ? "review" : "reviews"}</p></div>
          <div className="space-y-2.5">{histogram.map(({ rating, count }) => { const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0; return <div key={rating} className="grid grid-cols-[42px_minmax(0,1fr)_40px] items-center gap-2 text-xs text-[#657386]"><span>{rating} star</span><div className="h-2 overflow-hidden rounded-full bg-[#e6e8eb]"><span className="block h-full rounded-full bg-[#ffc400] transition-all" style={{ width: `${percent}%` }} /></div><span className="text-right">{percent}%</span></div>; })}</div>
        </div>

        <div className="pt-5">
          {reviews.length ? <div className="space-y-3">{reviews.map((review) => <article key={review._id} className="rounded-lg border border-[#edf0ee] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#26332b]">{review.user?.name || "FreshCart customer"}{ownedReview(review) && <span className="ml-2 rounded-full bg-[#edf8f0] px-2 py-0.5 text-[9px] font-medium text-[#168d43]">Your review</span>}</p><div className="mt-1.5 flex items-center gap-2"><RatingStars rating={review.rating} /><span className="text-[10px] text-[#8a958e]">{formatDate(review.createdAt)}</span></div></div>
              {ownedReview(review) && <div className="flex items-center gap-2"><button type="button" onClick={() => { setComposer({ mode: "edit", review }); setConfirmDeleteId(null); }} className="text-[10px] font-semibold text-[#159447] hover:underline">Edit</button><button type="button" onClick={() => setConfirmDeleteId((current) => current === review._id ? null : review._id)} className="text-[10px] font-semibold text-[#bd5555] hover:underline">Delete</button></div>}
            </div>
            <p className="mt-3 whitespace-pre-line text-xs leading-5 text-[#596675]">{review.review}</p>
            {confirmDeleteId === review._id && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#fff5f5] px-3 py-2"><span className="text-[10px] text-[#8e4a4a]">Delete this review?</span><span className="flex gap-2"><button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded px-2 py-1 text-[10px] text-[#707a73]">Keep</button><button type="button" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(review._id)} className="rounded bg-[#c94d4d] px-2.5 py-1 text-[10px] font-semibold text-white disabled:opacity-60">{deleteMutation.isPending ? "Deleting…" : "Delete review"}</button></span></div>}
          </article>)}</div> : <div className="py-7 text-center"><Star size={36} className="mx-auto fill-[#d7dbe1] text-[#d7dbe1]" /><p className="mt-3 text-sm text-[#758295]">Customer reviews will be displayed here.</p></div>}

          {composer && <ReviewComposer key={composer.mode === "edit" ? composer.review._id : "new-review"} initial={composer.mode === "edit" ? composer.review : undefined} busy={mutationBusy} onCancel={() => setComposer(null)} onSubmit={submitReview} />}
          {!composer && (loggedIn ? <button type="button" onClick={() => setComposer({ mode: "create" })} className="mt-4 block mx-auto text-sm font-medium text-[#16a34a] hover:underline">Write a Review</button> : <Link href={`/login?callbackUrl=${encodeURIComponent(`/productDatailes/${product._id}`)}`} className="mt-4 block text-center text-sm font-medium text-[#16a34a] hover:underline">Sign in to write a review</Link>)}
        </div>
      </>}
    </div>}

    {activeTab === "shipping" && <div role="tabpanel" className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
      <section className="rounded-lg bg-[#effcf3] p-5"><h2 className="flex items-center gap-3 text-sm font-semibold"><span className="flex size-10 items-center justify-center rounded-full bg-[#16a34a] text-white"><Truck size={20} /></span>Shipping Information</h2><ul className="mt-4 space-y-3 text-xs text-[#536272]">
        {["Free shipping on orders over 500 EGP", "Standard delivery: 3–5 business days", "Express delivery available (1–2 business days)", "Track your order in real-time"].map((item) => <li key={item} className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#16a34a]" />{item}</li>)}
      </ul></section>
      <section className="rounded-lg bg-[#effcf3] p-5"><h2 className="flex items-center gap-3 text-sm font-semibold"><span className="flex size-10 items-center justify-center rounded-full bg-[#16a34a] text-white"><RotateCcw size={20} /></span>Returns &amp; Refunds</h2><ul className="mt-4 space-y-3 text-xs text-[#536272]">
        {["30-day hassle-free returns", "Full refund or exchange available", "Free return shipping on defective items", "Easy online return process"].map((item) => <li key={item} className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#16a34a]" />{item}</li>)}
      </ul></section>
      <section className="flex items-center gap-3 rounded-lg bg-[#f7f8f9] p-5 sm:col-span-2"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7e9ed] text-[#546173]"><ShieldCheck size={20} /></span><div><h2 className="text-sm font-semibold">Buyer Protection Guarantee</h2><p className="mt-1 text-xs leading-5 text-[#677486]">Get a full refund if your order doesn’t arrive or isn’t as described. We ensure your shopping experience is safe and secure.</p></div></section>
    </div>}
  </section>;
}

function TabButton({ selected, onClick, icon, children }: { selected: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={selected} onClick={onClick} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-xs font-medium transition sm:px-6 sm:text-sm ${selected ? "border-[#159b4b] bg-[#f5fbf7] text-[#159b4b]" : "border-transparent text-[#485567] hover:bg-[#fafcfb] hover:text-[#159b4b]"}`}>{icon}{children}</button>;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return <div className="flex items-center justify-between gap-4"><dt className="text-[#718091]">{label}</dt><dd className="text-right font-medium text-[#202b36]">{value || "—"}</dd></div>;
}
