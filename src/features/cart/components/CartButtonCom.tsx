"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { usePreferences } from "@/components/ui-preferences";
import { useAddProductToCart } from "../hooks/useCart";

export default function CartButtonCom({
  productId,
  children,
  className,
  disabled = false,
  ariaLabel,
}: {
  productId: string;
  children: ReactNode;
  className: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const mutation = useAddProductToCart();
  const { t } = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const sessionQuery = useQuery({
    queryKey: ["auth-session"],
    queryFn: () => getSession(),
    retry: false,
  });

  async function handleAdd() {
    if (sessionQuery.isPending) return;
    if (!sessionQuery.data?.user) {
      const callbackUrl = `${pathname || "/"}${window.location.search}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    try {
      await mutation.mutateAsync(productId);
      toast.success(t("addedToCart"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("cartAddFailed"));
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled || mutation.isPending || sessionQuery.isPending}
      aria-label={ariaLabel}
      className={className}
    >
      {mutation.isPending ? <LoaderCircle size={18} className="animate-spin" /> : children}
    </button>
  );
}
