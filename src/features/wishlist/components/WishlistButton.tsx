"use client";

import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useSyncExternalStore } from "react";
import { usePreferences } from "@/components/ui-preferences";
import { useAddToWishlist, useRemoveFromWishlist, useWishlistQuery } from "../hooks/useWishlist";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function WishlistButton({ productId, productName, variant = "icon" }: { productId: string; productName: string; variant?: "icon" | "label" }) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { t } = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const sessionQuery = useQuery({ queryKey: ["auth-session"], queryFn: () => getSession(), retry: false });
  const wishlistQuery = useWishlistQuery({ enabled: Boolean(sessionQuery.data?.user) });
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const isSaved = Boolean(wishlistQuery.data?.payload.data.some((product) => product._id === productId));
  const isPending = addMutation.isPending || removeMutation.isPending;

  async function toggle() {
    if (!sessionQuery.data?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    try {
      if (isSaved) {
        await removeMutation.mutateAsync(productId);
        toast.success("Removed from your wishlist.");
      } else {
        await addMutation.mutateAsync(productId);
        toast.success("Added to your wishlist.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update your wishlist.");
    }
  }

  if (variant === "label") {
    return <button type="button" onClick={toggle} disabled={hydrated && (isPending || sessionQuery.isPending)} aria-pressed={isSaved} className="mt-4 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-stone-600 transition hover:text-emerald-700 disabled:opacity-60">
      {isPending ? <LoaderCircle size={17} className="animate-spin"/> : <Heart size={17} className={isSaved ? "fill-rose-500 text-rose-500" : ""}/>}
      {isSaved ? t("addedWishlist") : t("addWishlist")}
    </button>;
  }

  return <button type="button" onClick={toggle} disabled={hydrated && (isPending || sessionQuery.isPending)} aria-label={isSaved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`} aria-pressed={isSaved} className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-[#68716b] shadow-sm transition hover:text-rose-500 disabled:opacity-60">
    {isPending ? <LoaderCircle size={17} className="animate-spin"/> : <Heart size={17} className={isSaved ? "fill-rose-500 text-rose-500" : ""}/>}
  </button>;
}
