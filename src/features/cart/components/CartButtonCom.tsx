"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
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

  async function handleAdd() {
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
      disabled={disabled || mutation.isPending}
      aria-label={ariaLabel}
      className={className}
    >
      {mutation.isPending ? <LoaderCircle size={18} className="animate-spin" /> : children}
    </button>
  );
}
