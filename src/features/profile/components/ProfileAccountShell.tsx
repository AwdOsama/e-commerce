import Link from "next/link";
import { MapPin, Settings2 } from "lucide-react";

export default function ProfileAccountShell({ active, children }: { active: "addresses" | "settings"; children: React.ReactNode }) {
  const addressActive = active === "addresses";
  return <main className="flex-1 bg-[#f8fafc] pb-12 text-[#17212b]">
    <div className="bg-gradient-to-r from-[#11b94e] to-[#20ce62] text-white">
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs text-white/80"><Link href="/">Home</Link>&nbsp; / &nbsp;My Account</p>
        <div className="mt-4 flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-white/20"><span aria-hidden="true">♙</span></span><div><h1 className="text-xl font-bold">My Account</h1><p className="mt-0.5 text-xs text-white/80">Manage your addresses and account settings</p></div></div>
      </div>
    </div>
    <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[190px_minmax(0,1fr)] lg:px-8">
      <aside className="h-fit rounded-lg border border-[#e8edf0] bg-white p-3 shadow-sm">
        <h2 className="mb-2 px-2 py-1 text-xs font-semibold">My Account</h2>
        <Link href="/profile/addresses" aria-current={addressActive ? "page" : undefined} className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs ${addressActive ? "bg-[#effbf3] font-semibold text-[#16a34a]" : "text-[#64748b] hover:bg-[#f8faf9]"}`}><MapPin size={14}/><span>My Addresses</span>{addressActive && <span className="ml-auto">›</span>}</Link>
        <Link href="/profile/settings" aria-current={!addressActive ? "page" : undefined} className={`mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-xs ${!addressActive ? "bg-[#effbf3] font-semibold text-[#16a34a]" : "text-[#64748b] hover:bg-[#f8faf9]"}`}><Settings2 size={14}/><span>Settings</span>{!addressActive && <span className="ml-auto">›</span>}</Link>
      </aside>
      {children}
    </div>
  </main>;
}
