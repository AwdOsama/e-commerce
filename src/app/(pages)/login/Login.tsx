"use client";

import Link from "next/link";
import {
  Headphones,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "./schema/login.schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { cartQueryKey } from "@/src/features/cart/apis/cart.api";
const inputClassName =
  "mt-1.5 h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#4b5563] outline-none placeholder:text-[#9ca3af] focus:border-[#159f56] focus:ring-2 focus:ring-[#159f56]/15";

const serviceHighlights = [
  { icon: Truck, title: "Free Shipping", detail: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", detail: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", detail: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", detail: "Contact us anytime" },
];

function GroceryIllustration() {
  return (
    <div className="relative mx-auto flex aspect-[1.3/1] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-2xl bg-[#f8faf7]">
      <div className="absolute right-6 top-5 h-44 w-32 rounded-full bg-[#fce9d9] sm:right-10 sm:top-8 sm:h-56 sm:w-40" />
      <svg
        viewBox="0 0 520 390"
        role="img"
        aria-label="A basket full of fresh groceries"
        className="relative z-10 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="254" cy="330" rx="173" ry="18" fill="#dce8df" />
        <path d="M160 151 105 97c-9-9-23-11-35-7l-23 8" stroke="#687c73" strokeWidth="9" strokeLinecap="round" />
        <path d="m126 150 48 137c4 12 15 20 28 20h156c13 0 24-8 28-20l40-137H126Z" fill="#f6fbf7" stroke="#82968b" strokeWidth="8" strokeLinejoin="round" />
        <path d="m150 190 238 1M161 225l215 1M174 260h193M184 293h173M190 157l34 164M246 157l15 164M302 157l-7 164M357 157l-29 164" stroke="#b8c8bf" strokeWidth="5" />
        <path d="M171 151c-3-48 20-79 53-82 18 39 6 68-30 87M229 146c5-54 37-83 75-75 9 41-11 70-55 82M285 150c20-50 56-67 91-47-5 43-35 65-78 62M224 95c-1-39 20-62 53-66 18 31 8 57-27 74" fill="#63aa5a" />
        <path d="M195 151c18-35 39-57 65-76M252 148c14-29 32-51 56-68M300 154c23-23 44-38 67-48" stroke="#347d43" strokeWidth="5" strokeLinecap="round" />
        <path d="M137 109c-4-26 8-43 31-48 16 21 11 40-14 55" fill="#f4a640" />
        <path d="M344 127c5-29 24-43 50-36 7 25-6 43-34 50" fill="#e94e45" />
        <circle cx="146" cy="143" r="30" fill="#e9a52d" />
        <path d="M146 112c9-13 19-16 30-11-2 12-12 19-30 21" fill="#4d983f" />
        <circle cx="331" cy="116" r="28" fill="#e84b43" />
        <path d="M330 89c-1-13 6-20 18-21 6 12 1 20-15 25" fill="#55a348" />
        <path d="M209 151c2-31 20-48 48-45 9 26-4 45-37 53" fill="#f4cb42" />
        <circle cx="274" cy="121" r="31" fill="#f39432" />
        <path d="M273 90c2-13 10-20 22-18 4 13-2 21-19 25" fill="#559844" />
        <path d="M92 342h314" stroke="#91a39a" strokeWidth="8" strokeLinecap="round" />
        <circle cx="176" cy="351" r="19" fill="#697c73" />
        <circle cx="349" cy="351" r="19" fill="#697c73" />
        <circle cx="176" cy="351" r="7" fill="#f6fbf7" />
        <circle cx="349" cy="351" r="7" fill="#f6fbf7" />
      </svg>
      <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#159f56] shadow-sm sm:bottom-7 sm:left-7">
        Fresh every day
      </div>
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLogin(data: loginSchemaType) {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["auth-session"] }),
          queryClient.invalidateQueries({ queryKey: cartQueryKey, refetchType: "all" }),
        ]);
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
        return;
      }

      toast.error("Invalid email or password. Please try again.");
    } catch {
      toast.error("Unable to connect. Please try again.");
    }
  }

  return (
    <main className="flex-1 bg-white text-[#1f2937]">
      <section className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:min-h-[690px] lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14">
        <div className="mx-auto w-full max-w-[570px] text-center">
          <GroceryIllustration />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#252b2a] sm:text-3xl">
            FreshCart - Your One-Stop Shop for Fresh Products
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#6b7280]">
            Join thousands of happy customers who trust FreshCart for their daily groceries needs
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#58645e]">
            <span className="inline-flex items-center gap-1.5"><Truck size={14} className="text-[#159f56]" /> Free Delivery</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#159f56]" /> Secure Payment</span>
            <span className="inline-flex items-center gap-1.5"><Headphones size={14} className="text-[#159f56]" /> 24/7 Support</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[540px] rounded-xl border border-[#f0f1f0] bg-white p-6 shadow-[0_8px_28px_rgba(16,24,40,0.10)] sm:p-9 lg:p-10">
          <header className="text-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#159f56]">FreshCart</Link>
            <h2 className="mt-2 text-xl font-bold text-[#202522]">Welcome Back!</h2>
            <p className="mt-1 text-sm text-[#777f7a]">Sign in to continue your fresh shopping experience</p>
          </header>

          <div className="mt-6 grid gap-3">
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#e5e7eb] bg-white text-sm font-medium text-[#3f4542] transition hover:bg-[#f9fafb]">
              <span aria-hidden="true" className="font-bold text-[#4285f4]">G</span> Continue with Google
            </button>
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#e5e7eb] bg-white text-sm font-medium text-[#3f4542] transition hover:bg-[#f9fafb]">
              <FontAwesomeIcon
                icon={faFacebookF}
                aria-hidden="true"
                className="block h-4 w-[10px] shrink-0 text-[#1877f2]"
              />
              Continue with Facebook
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            Or continue with email
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          <form onSubmit={handleSubmit(handleLogin)} noValidate className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-xs font-medium text-[#404743]">Email Address</label>
              <div className="relative">
                <Mail aria-hidden="true" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`${inputClassName} pl-9`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                  })}
                />
              </div>
              {errors.email && <p id="login-email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="text-xs font-medium text-[#404743]">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-medium text-[#159f56] hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <LockKeyhole aria-hidden="true" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`${inputClassName} pl-9 pr-10`}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  {...register("password", { required: "Password is required" })}
                />
                <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">◉</span>
              </div>
              {errors.password && <p id="login-password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#68716b]">
              <input type="checkbox" className="size-3.5 rounded accent-[#159f56]" />
              Keep me signed in
            </label>

            <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#159f56] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12894a] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#68716b]">
            New to FreshCart? <Link href="/register" className="font-semibold text-[#159f56] hover:underline">Create an account</Link>
          </div>
          <div className="mt-5 flex items-center justify-center gap-4 border-t border-[#f0f1f0] pt-4 text-[10px] text-[#7b827e]">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={12} className="text-[#159f56]" /> SSL Secured</span>
            <span>♧ 50K+ Users</span>
            <span>★ 4.9 Rating</span>
          </div>
        </div>
      </section>

      <section aria-label="Shopping benefits" className="border-y border-[#e1f2e8] bg-[#f0fbf4]">
        <ul className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-10">
          {serviceHighlights.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#159f56] shadow-sm"><Icon aria-hidden="true" size={17} /></span>
              <span><span className="block text-xs font-semibold text-[#303a33] sm:text-sm">{title}</span><span className="mt-0.5 block text-[10px] text-[#7b827e] sm:text-xs">{detail}</span></span>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
