import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailFormValues } from "../schema/password-reset.schema";

export default function ResetEmailForm({ email, busy, onSubmit }: { email: string; busy: boolean; onSubmit: (data: EmailFormValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema), defaultValues: { email } });
  return <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9 space-y-6">
    <div><label htmlFor="reset-email" className="text-sm font-medium text-[#28332d]">Email Address</label><div className="relative mt-2"><Mail size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9ca3af]"/><input id="reset-email" type="email" autoComplete="email" placeholder="Enter your email address" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "reset-email-error" : undefined} className="h-16 w-full rounded-2xl border-2 border-[#e5e7eb] bg-white pl-[60px] pr-4 text-base text-[#27332d] outline-none placeholder:text-[#9ca3af] focus:border-[#16a34a]" {...register("email")}/></div>{errors.email && <p id="reset-email-error" role="alert" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div>
    <button disabled={busy} className="h-16 w-full rounded-2xl bg-[#16a34a] text-base font-bold text-white shadow-[0_9px_16px_rgba(0,0,0,.11)] transition hover:bg-[#12883d] disabled:opacity-60">{busy ? "Sending code..." : "Send Reset Code"}</button>
    <Link href="/login" className="flex items-center justify-center gap-2 py-1 text-sm font-medium text-[#16a34a]"><ArrowLeft size={17}/>Back to Sign In</Link>
  </form>;
}
