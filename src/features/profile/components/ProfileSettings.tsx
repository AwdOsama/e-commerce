"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { changePassword, getProfile, updateProfile, type Profile } from "../apis/profile.api";
import { changePasswordSchema, profileSchema, type ChangePasswordFormValues, type ProfileFormValues } from "../schema/profile.schema";
import { AccountSettingsPanel, ChangePasswordPanel } from "./SettingsPanels";
import ProfileAccountShell from "./ProfileAccountShell";

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });
  const profileForm = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues: { name: "", email: "", phone: "" } });
  const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { currentPassword: "", password: "", rePassword: "" } });

  useEffect(() => {
    if (profileQuery.data) profileForm.reset({ name: profileQuery.data.name, email: profileQuery.data.email, phone: profileQuery.data.phone });
  }, [profileQuery.data, profileForm]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (_result, values) => {
      profileForm.reset(values);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Your profile has been updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: async (_result, values) => {
      const email = profileQuery.data?.email;
      if (email) await signIn("credentials", { email, password: values.password, redirect: false });
      passwordForm.reset();
      toast.success("Your password has been changed.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const profile = profileQuery.data as Profile | undefined;
  return <ProfileAccountShell active="settings">
      <section className="min-w-0">
        <header className="mb-4"><h2 className="text-lg font-bold">Account Settings</h2><p className="mt-1 text-xs text-[#64748b]">Update your profile information and change your password</p></header>
        {profileQuery.isLoading ? <div className="rounded-lg border border-[#e8edf0] bg-white p-8 text-sm text-[#64748b]">Loading account settings…</div> : profileQuery.isError ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-700">{profileQuery.error.message}</div> : <>
          <AccountSettingsPanel form={profileForm} profile={profile} busy={profileMutation.isPending} onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))} />
          <ChangePasswordPanel form={passwordForm} busy={passwordMutation.isPending} onSubmit={passwordForm.handleSubmit((data) => passwordMutation.mutate(data))} />
        </>}
      </section>
    </ProfileAccountShell>;
}
