import { ArrowLeft, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, type CodeFormValues } from "../schema/password-reset.schema";

export default function ResetCodeForm({ code, busy, wait, onSubmit, onResend, onBack }: { code: string; busy: boolean; wait: number; onSubmit: (data: CodeFormValues) => void; onResend: () => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CodeFormValues>({ resolver: zodResolver(codeSchema), defaultValues: { resetCode: code } });
  return <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9 space-y-6">
    <div><label htmlFor="reset-code" className="text-sm font-medium text-[#28332d]">Reset Code</label><div className="relative mt-2"><KeyRound size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9ca3af]"/><input id="reset-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter the 6-digit code" aria-invalid={Boolean(errors.resetCode)} aria-describedby={errors.resetCode ? "reset-code-error" : undefined} className="h-16 w-full rounded-2xl border-2 border-[#e5e7eb] pl-[60px] text-lg tracking-[.4em] outline-none placeholder:tracking-normal focus:border-[#16a34a]" {...register("resetCode", { setValueAs: (value: string) => value.replace(/\D/g, "") })}/></div>{errors.resetCode ? <p id="reset-code-error" role="alert" className="mt-1 text-sm text-red-600">{errors.resetCode.message}</p> : <p className="mt-2 text-sm text-[#64748b]">We sent a code to your email address.</p>}</div>
    <button disabled={busy} className="h-16 w-full rounded-2xl bg-[#16a34a] text-base font-bold text-white shadow-lg disabled:opacity-60">{busy ? "Verifying..." : "Verify Code"}</button>
    <div className="flex items-center justify-center gap-1 text-sm text-[#64748b]">Didn’t receive the code? <button type="button" disabled={wait > 0 || busy} onClick={onResend} className="font-semibold text-[#16a34a] disabled:text-[#9ca3af]">{wait ? `Resend in ${wait}s` : "Resend Code"}</button></div>
    <button type="button" onClick={onBack} className="mx-auto flex items-center gap-2 text-sm text-[#16a34a]"><ArrowLeft size={16}/>Change email</button>
  </form>;
}
