import Link from "next/link";
import { ArrowRight, Headphones, Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const promotions = [
  {
    eyebrow: "🔥 Deal of the Day",
    title: "Fresh Organic Fruits",
    description: "Get up to 40% off on selected organic fruits",
    offer: "40% OFF",
    code: "ORGANIC40",
    action: "Shop Now",
    classes: "from-[#00b879] to-[#008d61]",
  },
  {
    eyebrow: "✦ New Arrivals",
    title: "Exotic Vegetables",
    description: "Discover our latest collection of premium vegetables",
    offer: "25% OFF",
    code: "FRESH25",
    action: "Explore Now",
    classes: "from-[#ff681a] to-[#ff315b]",
  },
];

const footerBenefits = [
  { icon: Truck, title: "Free Shipping", detail: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", detail: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", detail: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", detail: "Contact us anytime" },
];

export function HomePromotions() {
  return (
    <section aria-label="Current offers" className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:px-10">
      {promotions.map((promotion) => (
        <article key={promotion.title} className={`relative isolate min-h-[230px] overflow-hidden rounded-xl bg-gradient-to-br ${promotion.classes} px-5 py-5 text-white shadow-sm sm:px-7 sm:py-6 lg:min-h-[260px] lg:px-8 lg:py-7`}>
          <div aria-hidden="true" className="absolute -right-8 -top-12 -z-10 size-40 rounded-full bg-white/10" />
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-medium">{promotion.eyebrow}</span>
          <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{promotion.title}</h2>
          <p className="mt-1 max-w-sm text-[11px] text-white/80">{promotion.description}</p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-lg font-extrabold">{promotion.offer}</span>
            <span className="text-[10px] text-white/85">Use code: <b>{promotion.code}</b></span>
          </div>
          <Link href="/shop" className="mt-3 inline-flex h-8 items-center gap-2 rounded-full bg-white px-3.5 text-[10px] font-semibold text-[#078958] transition hover:bg-white/90">
            {promotion.action}<ArrowRight aria-hidden="true" size={13} />
          </Link>
        </article>
      ))}
    </section>
  );
}

export function HomeNewsletter() {
  return (
    <section aria-labelledby="newsletter-heading" className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="grid overflow-hidden rounded-[26px] border border-emerald-50 bg-[linear-gradient(115deg,#f1fff9_0%,#fff_48%,#fff6f5_100%)] p-5 shadow-[0_16px_55px_rgba(16,185,129,0.08)] sm:p-8 lg:grid-cols-[1.55fr_1fr] lg:gap-8 lg:p-10">
        <div className="flex flex-col justify-center lg:border-r lg:border-slate-200/70 lg:pr-8">
          <div className="inline-flex size-8 items-center justify-center rounded-lg bg-[#00b879] text-white shadow-sm"><span aria-hidden="true">✉</span></div>
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#00a66d]">Newsletter <span className="ml-2 normal-case tracking-normal text-slate-400">50,000+ subscribers</span></p>
          <h2 id="newsletter-heading" className="mt-2 text-xl font-bold tracking-tight text-[#172333] sm:text-2xl">Get the Freshest Updates <span className="text-[#00ad73]">Delivered Free</span></h2>
          <p className="mt-2 text-xs text-slate-500">Weekly recipes, seasonal offers & exclusive member perks.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Fresh Picks Weekly", "Free Delivery Codes", "Members-Only Deals"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-[9px] text-slate-600"><Leaf aria-hidden="true" size={11} className="text-emerald-500" />{item}</span>)}
          </div>
          <div className="mt-4 flex max-w-[580px] gap-2">
            <input type="email" aria-label="Email address" placeholder="you@example.com" className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#00ad73] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#009b67]">Subscribe <ArrowRight aria-hidden="true" size={14} /></button>
          </div>
          <p className="mt-2 text-[9px] text-slate-400">✨ Unsubscribe anytime. No spam, ever.</p>
        </div>
        <aside className="mt-6 flex min-h-[190px] flex-col justify-center rounded-2xl bg-[#111b2b] p-5 text-white shadow-xl sm:p-7 lg:mt-0">
          <span className="w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">Mobile App</span>
          <h3 className="mt-3 text-lg font-bold">Shop Faster on Our App</h3>
          <p className="mt-2 text-[10px] leading-5 text-slate-300/75">Get app-exclusive deals & 15% off your first order.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/10 px-3 py-2"><span className="block text-[8px] uppercase text-slate-300/70">Download on</span><span className="mt-0.5 block text-xs font-semibold"> &nbsp;App Store</span></div>
            <div className="rounded-lg border border-white/10 bg-white/10 px-3 py-2"><span className="block text-[8px] uppercase text-slate-300/70">Get it on</span><span className="mt-0.5 block text-xs font-semibold">▶ &nbsp;Google Play</span></div>
          </div>
          <p className="mt-3 text-[9px] text-amber-300">★★★★★ <span className="text-slate-300">4.9 · 100K+ downloads</span></p>
        </aside>
      </div>
    </section>
  );
}

export function FooterBenefits() {
  return (
    <div className="bg-[#effcf4]">
      <ul className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-4 sm:px-8 lg:px-12">
        {footerBenefits.map(({ icon: Icon, title, detail }) => <li key={title} className="flex items-center gap-3"><span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d9f8e4] text-[#00a866]"><Icon aria-hidden="true" size={15} /></span><span><span className="block text-[10px] font-semibold text-[#26352c]">{title}</span><span className="mt-0.5 block text-[9px] text-slate-500">{detail}</span></span></li>)}
      </ul>
    </div>
  );
}
