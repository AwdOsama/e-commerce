"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff, LockKeyhole, Save, UserRound } from "lucide-react";
import type { ChangePasswordFormValues, ProfileFormValues } from "../schema/profile.schema";
import type { Profile } from "../apis/profile.api";

const fieldClass = "mt-1 h-9 w-full rounded-md border border-[#e3e8ed] bg-white px-3 text-xs text-[#263746] outline-none placeholder:text-[#9aa7b4] focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10";
const labelClass = "block text-[10px] font-medium text-[#475569]";

export function AccountSettingsPanel({ form, profile, busy, onSubmit }: { form: UseFormReturn<ProfileFormValues>; profile?: Profile; busy: boolean; onSubmit: React.FormEventHandler<HTMLFormElement> }) {
  const { register, formState: { errors } } = form;
  return <div className="mb-4 rounded-lg border border-[#e8edf0] bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-[#e7f9ed] text-[#16a34a]"><UserRound size={16}/></span><div><h3 className="text-xs font-bold">Profile Information</h3><p className="text-[10px] text-[#64748b]">Update your personal details</p></div></div>
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div><label className={labelClass} htmlFor="profile-name">Full Name</label><input id="profile-name" autoComplete="name" className={fieldClass} {...register("name")}/>{errors.name && <p role="alert" className="mt-1 text-[10px] text-red-600">{errors.name.message}</p>}</div>
      <div><label className={labelClass} htmlFor="profile-email">Email Address</label><input id="profile-email" type="email" autoComplete="email" className={fieldClass} {...register("email")}/>{errors.email && <p role="alert" className="mt-1 text-[10px] text-red-600">{errors.email.message}</p>}</div>
      <div><label className={labelClass} htmlFor="profile-phone">Phone Number</label><input id="profile-phone" type="tel" autoComplete="tel" className={fieldClass} {...register("phone")}/>{errors.phone && <p role="alert" className="mt-1 text-[10px] text-red-600">{errors.phone.message}</p>}</div>
      <button type="submit" disabled={busy} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#16a34a] px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-[#12883d] disabled:opacity-60"><Save size={13}/>{busy ? "Saving…" : "Save Changes"}</button>
    </form>
    <div className="mt-4 border-t border-[#eef1f3] pt-3"><h4 className="mb-2 text-[10px] font-semibold">Account Information</h4><div className="grid grid-cols-2 gap-2 text-[10px]"><span className="text-[#64748b]">User ID</span><span className="truncate text-right text-[#334155]">{profile?.id || "—"}</span><span className="text-[#64748b]">Role</span><span className="justify-self-end rounded bg-[#e7f9ed] px-2 py-0.5 text-[#16a34a]">{profile?.role || "User"}</span></div></div>
  </div>;
}

function PasswordInput({ id, label, register, error }: { id: keyof ChangePasswordFormValues; label: string; register: UseFormReturn<ChangePasswordFormValues>["register"]; error?: string }) {
  const [visible, setVisible] = useState(false);
  return <div><label className={labelClass} htmlFor={id}>{label}</label><div className="relative"><LockKeyhole size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa7b4]"/><input id={id} type={visible ? "text" : "password"} autoComplete={id === "currentPassword" ? "current-password" : "new-password"} className={`${fieldClass} pl-9 pr-9`} {...register(id)}/><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">{visible ? <EyeOff size={14}/> : <Eye size={14}/>}</button></div>{error && <p role="alert" className="mt-1 text-[10px] text-red-600">{error}</p>}</div>;
}

export function ChangePasswordPanel({ form, busy, onSubmit }: { form: UseFormReturn<ChangePasswordFormValues>; busy: boolean; onSubmit: React.FormEventHandler<HTMLFormElement> }) {
  const { register, formState: { errors } } = form;
  return <div className="rounded-lg border border-[#e8edf0] bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-[#fff5df] text-[#f59e0b]"><LockKeyhole size={15}/></span><div><h3 className="text-xs font-bold">Change Password</h3><p className="text-[10px] text-[#64748b]">Update your account password</p></div></div>
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <PasswordInput id="currentPassword" label="Current Password" register={register} error={errors.currentPassword?.message}/>
      <PasswordInput id="password" label="New Password" register={register} error={errors.password?.message}/>
      <p className="-mt-2 text-[9px] text-[#64748b]">Must be at least 8 characters</p>
      <PasswordInput id="rePassword" label="Confirm New Password" register={register} error={errors.rePassword?.message}/>
      <button type="submit" disabled={busy} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#f28c00] px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-[#df7c00] disabled:opacity-60">{busy ? "Updating…" : "Change Password"}</button>
    </form>
  </div>;
}
