import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Mail, MapPin, Phone, ShoppingCart } from "lucide-react";
import { FooterBenefits } from "@/src/features/home/HomeSupportingSections";

const footerGroups: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics", href: "/shop" },
      { label: "Men's Fashion", href: "/shop" },
      { label: "Women's Fashion", href: "/shop" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/login" },
      { label: "Order History", href: "/profile/setting" },
      { label: "Wishlist", href: "/profile/setting" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:support@freshcart.com" },
      { label: "Help Center", href: "mailto:support@freshcart.com" },
      { label: "Shipping Info", href: "mailto:support@freshcart.com" },
      { label: "Returns & Refunds", href: "mailto:support@freshcart.com" },
      { label: "Track Order", href: "/profile/setting" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Cookie Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#101a2b] text-white">
      <FooterBenefits />
      <div className="mx-auto grid w-full max-w-[1440px] gap-x-12 gap-y-10 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-[2fr_repeat(4,minmax(0,1fr))] lg:px-12 lg:py-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 rounded bg-white px-3 py-1.5 text-lg font-extrabold tracking-tight text-[#101a2b]">
            <ShoppingCart aria-hidden="true" size={19} className="text-[#08b765]" />
            FreshCart
          </Link>
          <p className="mt-4 max-w-[390px] text-xs leading-[1.7] text-slate-300/70">
            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
          </p>
          <ul className="mt-4 space-y-2 text-[11px] text-slate-300/75">
            <li className="flex items-center gap-2"><Phone aria-hidden="true" size={13} className="text-[#08c778]" /> +1 (800) 123-4567</li>
            <li className="flex items-center gap-2"><Mail aria-hidden="true" size={13} className="text-[#08c778]" /> support@freshcart.com</li>
            <li className="flex items-center gap-2"><MapPin aria-hidden="true" size={13} className="text-[#08c778]" /> 123 Commerce Street, New York, NY 10001</li>
          </ul>
          <div className="mt-4 flex items-center gap-2" aria-label="Social media">
            {[{ label: "Facebook", icon: faFacebookF }, { label: "Twitter", icon: faTwitter }, { label: "Instagram", icon: faInstagram }, { label: "YouTube", icon: faYoutube }].map(({ label, icon }) => (
              <span key={label} aria-label={label} role="img" className="inline-flex size-8 items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
                <FontAwesomeIcon icon={icon} aria-hidden="true" className="size-3.5" />
              </span>
            ))}
          </div>
        </div>

        {footerGroups.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <h2 className="text-xs font-semibold text-white">{title}</h2>
            <ul className="mt-4 space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <Link href={href} className="text-[11px] text-slate-300/70 transition hover:text-white">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-300/70">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-4 text-[10px] text-slate-400/70 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© 2026 FreshCart. All rights reserved.</p>
          <div className="flex items-center gap-3"><span>▤ &nbsp;Visa</span><span>▤ &nbsp;Mastercard</span><span>▤ &nbsp;PayPal</span></div>
        </div>
      </div>
    </footer>
  );
}
