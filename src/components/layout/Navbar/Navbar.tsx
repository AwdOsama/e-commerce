'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ClipboardList, Heart, Languages, MapPin, Menu, Moon, Settings2, ShoppingCart, Sun, Tag, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, signOut } from "next-auth/react";
import { usePreferences } from "@/components/ui-preferences";
import { useCartQuery } from "@/src/features/cart/hooks/useCart";
import { cartQueryKey } from "@/src/features/cart/apis/cart.api";
import { useWishlistQuery } from "@/src/features/wishlist/hooks/useWishlist";
import NavbarSearch from "./NavbarSearch";

const authSessionQueryKey = ["auth-session"] as const;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, locale, setLocale, theme, toggleTheme } = usePreferences();
  const sessionQuery = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: () => getSession(),
    retry: false,
    refetchOnWindowFocus: true,
  });
  const userName = sessionQuery.data?.user?.name?.trim();
  const isSignedIn = Boolean(sessionQuery.data?.user);
  const cartQuery = useCartQuery();
  const cartCount = cartQuery.data?.payload.numOfCartItems ?? 0;
  const showCartCount = Boolean(cartQuery.data);
  const wishlistQuery = useWishlistQuery({ enabled: isSignedIn });
  const wishlistCount = wishlistQuery.data?.payload.data.length ?? 0;
  const navLinks = [
    { label: t("home"), href: "/" }, { label: t("shop"), href: "/shop" },
    { label: t("categories"), href: "/categories" }, { label: t("brands"), href: "/brands" },
    { label: t("cart"), href: "/cart" },
  ];
  const themeButton = (
    <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t("themeLight") : t("themeDark")} className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      {theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  );
  const languageButton = (
    <button type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label={t("switchLanguage")} title={t("switchLanguage")} className="inline-flex h-9 min-w-16 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <Languages size={16} aria-hidden="true" /><span>{locale === "ar" ? "EN" : "AR"}</span>
    </button>
  );
  const accountMenu = (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isAccountMenuOpen}
        aria-haspopup="menu"
        onClick={() => setIsAccountMenuOpen((open) => !open)}
        className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="max-w-36 truncate">{isSignedIn ? userName || "Account" : "Account"}</span> <ChevronDown aria-hidden="true" size={16} className={isAccountMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {isAccountMenuOpen && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-md border border-border bg-background p-1 shadow-lg">
          {!sessionQuery.isPending && !isSignedIn && <>
            <Link role="menuitem" href="/login" onClick={() => setIsAccountMenuOpen(false)} className="block rounded px-3 py-2 text-sm text-foreground hover:bg-muted">Login</Link>
            <Link role="menuitem" href="/register" onClick={() => setIsAccountMenuOpen(false)} className="block rounded px-3 py-2 text-sm text-foreground hover:bg-muted">Register</Link>
          </>}
          {isSignedIn && <>
            <Link role="menuitem" href="/orders" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-foreground hover:bg-muted"><ClipboardList size={15}/>My Orders</Link>
            <Link role="menuitem" href="/profile/addresses" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-foreground hover:bg-muted"><MapPin size={15}/>My Addresses</Link>
            <Link role="menuitem" href="/wishlist" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-foreground hover:bg-muted"><Heart size={15}/>Wishlist{wishlistCount > 0 && <span className="ml-auto rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}</Link>
            <Link role="menuitem" href="/profile/settings" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-foreground hover:bg-muted"><Settings2 size={15}/>Settings</Link>
          </>}
          <Link role="menuitem" href="/brands" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-foreground hover:bg-muted"><Tag size={15}/>Brands</Link>
          {isSignedIn && <button
            role="menuitem"
            type="button"
            onClick={async () => {
              setIsAccountMenuOpen(false);
              await signOut({ redirect: false });
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: authSessionQueryKey }),
                queryClient.invalidateQueries({ queryKey: cartQueryKey, refetchType: "all" }),
              ]);
              router.push("/");
              router.refresh();
            }}
            className="block w-full rounded px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
          >
            Logout
          </button>}
        </div>
      )}
    </div>
  );

  return (
    <header className="relative z-50 border-b border-slate-100 bg-white text-slate-800">
      <div className="hidden border-b border-slate-100 bg-white md:block">
        <div className="mx-auto flex h-8 w-full max-w-[1440px] items-center justify-between px-5 text-[10px] text-slate-500 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6"><span>🚚&nbsp; Free Shipping on Orders 500 EGP</span><span>✦&nbsp; New Arrivals Daily</span></div>
          <div className="flex items-center gap-5"><a href="tel:+18001234567" className="hover:text-[#00a866]">+1 (800) 123-4567</a><a href="mailto:support@freshcart.com" className="hover:text-[#00a866]">support@freshcart.com</a>{isSignedIn && <span>♙&nbsp; {userName || "Account"}</span>}{!sessionQuery.isPending && !isSignedIn && <Link href="/login" className="hover:text-[#00a866]">Sign In</Link>}</div>
        </div>
      </div>
      <nav
        aria-label={t("mainNavigation")}
        className="mx-auto flex min-h-[68px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
      >
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold tracking-tight text-slate-800"
          aria-label="Fresh Cart home"
          onClick={() => setIsMenuOpen(false)}
        >
          <ShoppingCart aria-hidden="true" size={20} className="mr-1 inline-block text-[#00b879]" />FreshCart
        </Link>

        <NavbarSearch className="hidden w-[190px] shrink-0 lg:block xl:w-full xl:max-w-[440px] xl:flex-1" />

        <div className="hidden items-center gap-3 lg:flex xl:gap-5">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-label={href === "/cart" ? `${label}, ${cartCount} items` : undefined}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-[#00a866]"
            >
              {href === "/cart" && (
                <span className="relative inline-flex">
                  <ShoppingCart aria-hidden="true" size={18} />
                  {showCartCount && <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ef625d] px-1 text-[9px] font-bold leading-none text-white">{cartCount > 99 ? "99+" : cartCount}</span>}
                </span>
              )}
              {label}
              {href === "/categories" && <ChevronDown aria-hidden="true" size={12} />}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-0.5 lg:flex">
          <Link href="/wishlist" aria-label={`${t("wishlist")}, ${wishlistCount} items`} className="relative inline-flex size-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-emerald-50 hover:text-[#00a866]"><Heart aria-hidden="true" size={17} />{wishlistCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ef625d] px-1 text-[9px] font-bold leading-none text-white">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}</Link>
          {themeButton}
          {languageButton}
          {accountMenu}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full border-b border-slate-100 bg-white px-4 py-3 shadow-lg lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              <NavbarSearch className="mb-2 w-full" />
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={href === "/cart" ? `${label}, ${cartCount} items` : undefined}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {href === "/cart" && (
                    <span className="relative inline-flex">
                      <ShoppingCart aria-hidden="true" size={18} />
                      {showCartCount && <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ef625d] px-1 text-[9px] font-bold leading-none text-white">{cartCount > 99 ? "99+" : cartCount}</span>}
                    </span>
                  )}
                  {label}
                </Link>
              ))}
              <Link href="/wishlist" aria-label={`${t("wishlist")}, ${wishlistCount} items`} className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary" onClick={() => setIsMenuOpen(false)}><Heart size={18}/>{t("wishlist")}{wishlistCount > 0 && <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}</Link>
              <div className="mt-2 flex items-center justify-end gap-2 border-t border-border px-3 pt-3">
                {themeButton}
                {languageButton}
                {accountMenu}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
