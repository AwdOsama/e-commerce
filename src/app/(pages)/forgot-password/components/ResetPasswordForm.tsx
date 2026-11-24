import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, type PasswordFormValues } from "../schema/password-reset.schema";

function PasswordField({ id, label, placeholder, register, error, visible, toggle }: { id: "password" | "confirmPassword"; label: string; placeholder: string; register: ReturnType<typeof useForm<PasswordFormValues>>["register"]; error?: string; visible: boolean; toggle: () => void }) {
  return <div><label htmlFor={id} className="text-sm font-medium text-[#28332d]">{label}</label><div className="relative mt-2"><LockKeyhole size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9ca3af]"/><input id={id} type={visible ? "text" : "password"} autoComplete="new-password" placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-16 w-full rounded-2xl border-2 border-[#e5e7eb] pl-[60px] pr-14 text-base outline-none placeholder:text-[#9ca3af] focus:border-[#16a34a]" {...register(id)}/><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={toggle} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9ca3af]">{visible ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>{error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}</div>;
}

export default function ResetPasswordForm({ busy, onSubmit, showPassword, setShowPassword, showConfirm, setShowConfirm }: { busy: boolean; onSubmit: (data: PasswordFormValues) => void; showPassword: boolean; setShowPassword: (v: boolean) => void; showConfirm: boolean; setShowConfirm: (v: boolean) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema), defaultValues: { password: "", confirmPassword: "" } });
  return <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9 space-y-6">
    <PasswordField id="password" label="New Password" placeholder="Enter new password" register={register} error={errors.password?.message} visible={showPassword} toggle={() => setShowPassword(!showPassword)} />
    <PasswordField id="confirmPassword" label="Confirm Password" placeholder="Confirm new password" register={register} error={errors.confirmPassword?.message} visible={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
    <p className="-mt-3 text-xs text-[#64748b]">Use at least 8 characters with uppercase, lowercase, a number, and a symbol.</p>
    <button disabled={busy} className="h-16 w-full rounded-2xl bg-[#16a34a] text-base font-bold text-white shadow-lg disabled:opacity-60">{busy ? "Resetting password..." : "Reset Password"}</button>
  </form>;
}
