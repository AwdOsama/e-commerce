"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { usePreferences } from "@/components/ui-preferences";

const pageLabels: Record<string, string> = {
  brands: "Brands",
  cart: "Cart",
  categories: "Categories",
  shop: "Shop",
  productDatailes: "Product Details",
};

export default function Breadcrumbs() {
  const { t, locale } = usePreferences();
  const pathname = usePathname() || "/";
  if (pathname === "/login") return null;
  if (pathname === "/profile/settings" || pathname === "/profile/addresses") return null;
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: t("home"), href: "/" }];
  let currentPath = "";

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    currentPath += `/${segment}`;

    if (segment === "productDatailes") {
      const productId = segments[index + 1];
      if (productId) {
        currentPath += `/${productId}`;
        index += 1;
      }
      crumbs.push({ label: t("productDetails"), href: currentPath });
      continue;
    }

    const key = ({ brands: "brands", cart: "cart", categories: "categories", shop: "shop" } as const)[segment as "brands" | "cart" | "categories" | "shop"];
    const label = key ? t(key) : pageLabels[segment] ?? decodeURIComponent(segment)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    crumbs.push({ label, href: currentPath });
  }

  return (
    <nav aria-label="Breadcrumb" className="container py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;

          return (
            <li key={`${crumb.href}-${crumb.label}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  size={15}
                  className={`text-muted-foreground ${locale === "ar" ? "rotate-180" : ""}`}
                />
              )}
              {isCurrent ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
