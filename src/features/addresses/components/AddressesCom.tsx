"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MapPin, MapPinned, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { AddressFormValues } from "../schema/address.schema";
import type { UserAddress } from "../interfaces/address.interface";
import { useAddAddress, useAddressesQuery, useRemoveAddress, useReplaceAddress } from "../hooks/useAddresses";
import ProfileAccountShell from "@/src/features/profile/components/ProfileAccountShell";
import AddressFormDialog from "./AddressFormDialog";

export default function AddressesCom() {
  const [dialogAddress, setDialogAddress] = useState<UserAddress | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const addressesQuery = useAddressesQuery();
  const addMutation = useAddAddress();
  const replaceMutation = useReplaceAddress();
  const removeMutation = useRemoveAddress();
  const saveMutation = useMutation({
    mutationFn: ({ address, data }: { address: UserAddress | null; data: AddressFormValues }) =>
      address ? replaceMutation.mutateAsync({ addressId: address._id, data }) : addMutation.mutateAsync(data),
    onSuccess: () => {
      setIsDialogOpen(false);
      setDialogAddress(null);
      toast.success("Address saved successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const addresses = addressesQuery.data?.payload.data ?? [];

  async function removeAddress(address: UserAddress) {
    try { await removeMutation.mutateAsync(address._id); toast.success("Address removed."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to remove this address."); }
  }

  function openAddDialog() { setDialogAddress(null); setIsDialogOpen(true); }
  function openEditDialog(address: UserAddress) { setDialogAddress(address); setIsDialogOpen(true); }

  return <ProfileAccountShell active="addresses">
    <section className="min-w-0">
      <header className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">My Addresses</h2><p className="mt-1 text-xs text-[#64748b]">Manage your saved delivery addresses</p></div><button type="button" onClick={openAddDialog} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-[#16a34a] px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-[#12883d] sm:h-9 sm:px-4 sm:text-xs"><Plus size={14}/>Add Address</button></header>
      {addressesQuery.isPending ? <div role="status" className="rounded-lg border border-[#e8edf0] bg-white p-8 text-sm text-[#64748b]">Loading your addresses…</div> : addressesQuery.isError ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-700">{addressesQuery.error.message}</div> : addresses.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {addresses.map((address) => <AddressCard key={address._id} address={address} busy={removeMutation.isPending || saveMutation.isPending} onEdit={() => openEditDialog(address)} onRemove={() => void removeAddress(address)}/>)}
      </div> : <div className="rounded-lg border border-[#e8edf0] bg-white px-5 py-12 text-center"><MapPin className="mx-auto text-[#9aa7a0]" size={28}/><h3 className="mt-3 text-sm font-semibold">No addresses saved yet</h3><p className="mt-1 text-xs text-[#64748b]">Add a delivery address to speed up your next order.</p><button type="button" onClick={openAddDialog} className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-[#16a34a] px-4 text-xs font-semibold text-white"><Plus size={14}/>Add Address</button></div>}
    </section>
    {isDialogOpen && <AddressFormDialog address={dialogAddress} busy={saveMutation.isPending} onClose={() => { setIsDialogOpen(false); setDialogAddress(null); }} onSubmit={(data) => saveMutation.mutate({ address: dialogAddress, data })}/>}
  </ProfileAccountShell>;
}

function AddressCard({ address, busy, onEdit, onRemove }: { address: UserAddress; busy: boolean; onEdit: () => void; onRemove: () => void }) {
  return <article className="rounded-lg border border-[#e8edf0] bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-2.5"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f8ee] text-[#16a34a]"><MapPinned size={16}/></span><div className="min-w-0"><h3 className="truncate text-xs font-bold text-[#26312b]">{address.name}</h3><p className="mt-0.5 text-[10px] text-[#16a34a]">{address.city}</p></div></div><div className="flex shrink-0 gap-1"><button type="button" disabled={busy} onClick={onEdit} aria-label={`Edit ${address.name} address`} className="flex size-7 items-center justify-center rounded-md border border-[#e8ece9] text-[#75817a] hover:bg-[#f5faf6] hover:text-[#159447] disabled:opacity-50"><Pencil size={12}/></button><button type="button" disabled={busy} onClick={onRemove} aria-label={`Remove ${address.name} address`} className="flex size-7 items-center justify-center rounded-md border border-[#e8ece9] text-[#75817a] hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 size={12}/></button></div></div>
    <div className="mt-3 border-t border-[#f0f2f0] pt-3 text-[10px] leading-5 text-[#64748b]"><p>{address.details}</p><p className="mt-1">{address.phone}</p><p className="mt-1 flex items-center gap-1 text-[#718078]"><MapPin size={11}/>{address.city}</p></div>
  </article>;
}
