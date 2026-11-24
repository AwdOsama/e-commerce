"use client";
import Link from "next/link";
import { UserRoundPlus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { registerSchema, regitsreSchemeType } from "./schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "./api/register.api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const benefits = [
  {
    title: "Premium Quality",
    description: "Carefully selected products from trusted brands",
  },
  { title: "Fast Delivery", description: "Same-day delivery to your doorstep" },
  {
    title: "Secure Shopping",
    description: "Your data and payments are always safe",
  },
];

const serviceHighlights = [
  { icon: "↻", title: "Free Shipping", detail: "On orders over 500 EGP" },
  { icon: "↩", title: "Easy Returns", detail: "14-day return policy" },
  { icon: "◇", title: "Secure Payment", detail: "100% secure checkout" },
  { icon: "♧", title: "24/7 Support", detail: "Contact us anytime" },
];

const inputClassName =
  "mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function Register() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<regitsreSchemeType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });
  const passwordChecks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[@$!%*?&]/.test(password),
  ];
  const passwordStrength = passwordChecks.filter(Boolean).length;
  const strengthLabel =
    password.length === 0
      ? "Enter a password"
      : passwordStrength <= 2
        ? "Weak"
        : passwordStrength <= 4
          ? "Medium"
          : "Strong";
  const strengthColor =
    passwordStrength <= 2
      ? "bg-destructive"
      : passwordStrength <= 4
        ? "bg-amber-500"
        : "bg-primary";

  async function handleRegister(data: regitsreSchemeType) {
    try {
      const isSuccess = await signUp(data);

      if (isSuccess) {
        toast.success("Account created successfully. Please sign in.");
        router.push("/login");
        return;
      }

      toast.error("We couldn't create your account. Please try again.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't create your account. Please try again.");
    }
  }

  return (
    <main className="bg-background">
      <section className="container grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to <span className="text-primary">FreshCart</span>
          </h1>
          <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
            Join thousands of happy customers and get groceries delivered right
            to your door.
          </p>

          <ul className="mt-8 space-y-5">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>
                  <span className="block font-semibold text-foreground">
                    {benefit.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {benefit.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <figure className="mt-8 max-w-lg rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                aria-hidden="true"
              >
                SJ
              </span>
              <div>
                <figcaption className="text-sm font-semibold text-foreground">
                  Sarah Johnson
                </figcaption>
                <div
                  className="mt-0.5 flex gap-0.5 text-amber-400"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </div>
              </div>
            </div>
            <blockquote className="mt-3 text-sm italic leading-6 text-muted-foreground">
              “FreshCart has transformed my shopping experience. The quality of
              the products is outstanding, and the delivery is always on time.
              Highly recommended!”
            </blockquote>
          </figure>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-8">
          <header className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create Your Account
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start your fresh journey with us today
            </p>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted"
            >
              <span
                className="text-lg font-bold text-red-600"
                aria-hidden="true"
              >
                G
              </span>{" "}
              Google
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted"
            >
              <span
                className="inline-flex size-5 items-center justify-center rounded-full bg-[#1877F2] text-sm font-bold text-white"
                aria-hidden="true"
              >
                f
              </span>{" "}
              Facebook
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="register-name"
                  className="text-sm font-medium text-foreground"
                >
                  Name<span className="text-primary">*</span>
                </label>
                <input
                  id="register-name"
                  autoComplete="name"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.name)}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email<span className="text-primary">*</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password<span className="text-primary">*</span>
                </label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.password)}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Use at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}

                <div
                  className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground"
                  aria-live="polite"
                >
                  <span className="min-w-0 flex-1">
                    Must be at least 8 characters with numbers and symbols.
                  </span>
                  <span
                    className="flex h-1 w-12 shrink-0 gap-0.5 overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    {passwordChecks.map((isMet, index) => (
                      <span
                        key={index}
                        className={`h-full flex-1 rounded-full ${
                          isMet ? strengthColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength <= 2
                        ? "text-destructive"
                        : passwordStrength <= 4
                          ? "text-amber-600"
                          : "text-primary"
                    }`}
                  >
                    {strengthLabel}
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="register-repassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password<span className="text-primary">*</span>
                </label>
                <input
                  id="register-repassword"
                  type="password"
                  autoComplete="new-password"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.rePassword)}
                  {...register("rePassword", {
                    required: "Please confirm your password",
                    validate: (value, values) =>
                      value === values.password || "Passwords do not match",
                  })}
                />
                {errors.rePassword && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="register-phone"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number<span className="text-primary">*</span>
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <p role="alert" className="mt-1 text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>
                  I agree to the{" "}
                  <span className="font-medium text-primary">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-primary">
                    Privacy Policy
                  </span>
                  <span className="text-primary">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserRoundPlus aria-hidden="true" size={16} />{" "}
                {isSubmitting ? "Creating account..." : "Create My Account"}
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>

      <section
        aria-label="Shopping benefits"
        className="border-y border-primary/10 bg-primary/5"
      >
        <ul className="container grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">
          {serviceHighlights.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg text-primary"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span>
                <span className="block text-xs font-semibold text-foreground sm:text-sm">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground sm:text-xs">
                  {item.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
