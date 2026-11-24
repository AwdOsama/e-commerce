"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { CodeFormValues, EmailFormValues, PasswordFormValues } from "./schema/password-reset.schema";
import { requestResetCode, resetPassword, verifyResetCode } from "./api/password-reset.api";
import ResetIllustration from "./components/ResetIllustration";
import ResetStepIndicator from "./components/ResetStepIndicator";
import ResetEmailForm from "./components/ResetEmailForm";
import ResetCodeForm from "./components/ResetCodeForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

const LIMIT_KEY = "freshcart-reset-attempts";
const COOLDOWN = 60;
const WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS = 3;

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!wait) return;
    const timer = window.setTimeout(() => setWait((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  function reserveAttempt() {
    const now = Date.now();
    let attempts: number[] = [];
    try { attempts = JSON.parse(sessionStorage.getItem(LIMIT_KEY) || "[]"); } catch { /* use a fresh local window */ }
    attempts = attempts.filter((timestamp) => now - timestamp < WINDOW);
    if (attempts.length >= MAX_REQUESTS) {
      const remaining = Math.ceil((WINDOW - (now - attempts[0])) / 1000);
      setWait(Math.max(remaining, 1));
      throw new Error("Too many code requests. Please try again later.");
    }
    attempts.push(now);
    sessionStorage.setItem(LIMIT_KEY, JSON.stringify(attempts));
    setWait(COOLDOWN);
  }

  async function onRequestCode(data: EmailFormValues) {
    if (wait) return toast.error(`Please wait ${wait} seconds before requesting another code.`);
    setBusy(true);
    try {
      reserveAttempt();
      await requestResetCode(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success("Reset code sent. Check your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send a reset code.");
    } finally { setBusy(false); }
  }

  async function onVerify(data: CodeFormValues) {
    setBusy(true);
    try {
      await verifyResetCode(data.resetCode);
      setStep(3);
      toast.success("Code verified!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That code could not be verified.");
    } finally { setBusy(false); }
  }

  async function onResend() {
    if (wait || busy) return;
    setBusy(true);
    try {
      reserveAttempt();
      await requestResetCode(email);
      toast.success("A new reset code has been sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to resend the code.");
    } finally { setBusy(false); }
  }

  async function onReset(data: PasswordFormValues) {
    setBusy(true);
    try {
      await resetPassword(email, data.password);
      const login = await signIn("credentials", { email, password: data.password, redirect: false });
      toast.success("Password reset successfully.");
      if (login?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset your password.");
    } finally { setBusy(false); }
  }

  const titles = ["Forgot Password?", "Verify Reset Code", "Create New Password"];
  const subtitles = ["No worries, we'll send you a reset code", "Enter the code we sent to your email", "Your new password must be different from previous passwords"];

  return <main className="flex-1 bg-white text-[#1f2937]">
    <section className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-4 py-10 sm:px-8 sm:py-14 lg:min-h-[calc(100vh-200px)] lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-14">
      <div className="mx-auto w-full max-w-[770px] text-center">
        <ResetIllustration />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#202b35] sm:text-4xl">Reset Your Password</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#40566c] sm:text-xl">Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account in no time.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-[#60758a] sm:text-base"><span className="inline-flex items-center gap-2"><span className="text-[#16a34a]">✉</span>Email Verification</span><span className="inline-flex items-center gap-2"><span className="text-[#16a34a]">◈</span>Secure Reset</span><span className="inline-flex items-center gap-2"><span className="text-[#16a34a]">♟</span>Encrypted</span></div>
      </div>

      <div className="mx-auto w-full max-w-[770px] rounded-[22px] border border-[#f3f4f6] bg-white px-6 py-9 shadow-[0_14px_30px_rgba(0,0,0,.14)] sm:px-12 sm:py-12">
        <header className="text-center"><Link href="/" className="text-4xl font-extrabold tracking-tight text-[#16a34a]">Fresh<span className="text-[#202b35]">Cart</span></Link><h2 className="mt-5 text-2xl font-bold text-[#202b35] sm:text-3xl">{titles[step - 1]}</h2><p className="mt-2 text-base text-[#40566c] sm:text-lg">{subtitles[step - 1]}</p></header>
        <ResetStepIndicator step={step} />
        {step === 1 && <ResetEmailForm email={email} busy={busy} onSubmit={onRequestCode} />}
        {step === 2 && <ResetCodeForm code="" busy={busy} wait={wait} onSubmit={onVerify} onResend={onResend} onBack={() => setStep(1)} />}
        {step === 3 && <ResetPasswordForm busy={busy} onSubmit={onReset} showPassword={showPassword} setShowPassword={setShowPassword} showConfirm={showConfirm} setShowConfirm={setShowConfirm} />}
        {step === 1 && <div className="mt-8 border-t border-[#f0f1f0] pt-7 text-center text-base text-[#40566c]">Remember your password? <Link href="/login" className="font-semibold text-[#16a34a]">Sign In</Link></div>}
      </div>
    </section>
  </main>;
}
