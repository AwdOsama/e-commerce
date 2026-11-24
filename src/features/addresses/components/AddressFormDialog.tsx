"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { addressSchema, type AddressFormValues } from "../schema/address.schema";
import type { UserAddress } from "../interfaces/address.interface";

const inputClass = "mt-1.5 h-10 w-full rounded-md border border-[#e2e8e5] px-3 text-sm text-[#26312b] outline-none placeholder:text-[#9aa39e] focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10";
const labelClass = "block text-xs font-medium text-[#475569]";

export default function AddressFormDialog({ address, busy, onClose, onSubmit }: { address: UserAddress | null; busy: boolean; onClose: () => void; onSubmit: (data: AddressFormValues) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  });

  useEffect(() => {
    reset(address ? { name: address.name, details: address.details, phone: address.phone, city: address.city } : { name: "", details: "", phone: "", city: "" });
  }, [address, reset]);

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="address-dialog-title" className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-4"><div><h2 id="address-dialog-title" className="text-lg font-bold text-[#1e293b]">{address ? "Edit Address" : "Add New Address"}</h2><p className="mt-1 text-xs text-[#64748b]">Save a delivery address to make checkout easier.</p></div><button type="button" onClick={onClose} aria-label="Close address form" className="rounded-md p-1.5 text-[#64748b] hover:bg-[#f1f5f9]"><X size={18}/></button></header>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div><label className={labelClass} htmlFor="address-name">Address Name</label><input id="address-name" placeholder="Home, Work..." className={inputClass} {...register("name")}/>{errors.name && <p role="alert" className="mt-1 text-xs text-red-600">{errors.name.message}</p>}</div>
        <div><label className={labelClass} htmlFor="address-details">Address Details</label><textarea id="address-details" rows={3} placeholder="Street, building, apartment..." className={`${inputClass} h-auto py-2.5`} {...register("details")}/>{errors.details && <p role="alert" className="mt-1 text-xs text-red-600">{errors.details.message}</p>}</div>
        <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="address-city">City</label><input id="address-city" placeholder="Your city" className={inputClass} {...register("city")}/>{errors.city && <p role="alert" className="mt-1 text-xs text-red-600">{errors.city.message}</p>}</div><div><label className={labelClass} htmlFor="address-phone">Phone Number</label><input id="address-phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className={inputClass} {...register("phone")}/>{errors.phone && <p role="alert" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}</div></div>
        <div className="flex justify-end gap-2 border-t border-[#eef1ef] pt-4"><button type="button" onClick={onClose} className="h-9 rounded-md border border-[#e2e8e5] px-4 text-xs font-semibold text-[#52615a] hover:bg-[#f8faf9]">Cancel</button><button type="submit" disabled={busy} className="h-9 rounded-md bg-[#16a34a] px-4 text-xs font-semibold text-white hover:bg-[#12883d] disabled:opacity-60">{busy ? "Saving…" : address ? "Save Changes" : "Add Address"}</button></div>
      </form>
    </section>
  </div>;
}
