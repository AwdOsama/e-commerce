import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function ResetIllustration() {
  return <div className="relative flex aspect-[1.55/1] w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#effcf4]">
    <span className="absolute left-[6%] top-[10%] size-28 rounded-full bg-[#e4faec]" />
    <span className="absolute right-[7%] top-[18%] size-20 rounded-full bg-[#e2f9eb]" />
    <span className="absolute bottom-[11%] right-[7%] size-40 rounded-full bg-[#e5faed]" />
    <div className="relative flex items-center gap-3 sm:gap-5">
      <span className="flex size-16 -rotate-12 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-[0_12px_20px_rgba(25,70,45,.12)]"><Mail size={25} fill="currentColor" /></span>
      <span className="flex size-32 rotate-3 items-center justify-center rounded-[30px] bg-white shadow-[0_14px_22px_rgba(25,70,45,.12)]"><span className="flex size-24 items-center justify-center rounded-[24px] bg-[#dcfce7] text-[#16a34a]"><LockKeyhole size={44} fill="currentColor" /></span></span>
      <span className="flex size-16 rotate-12 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-[0_12px_20px_rgba(25,70,45,.12)]"><ShieldCheck size={27} fill="currentColor" /></span>
    </div>
    <div className="absolute bottom-[24%] flex gap-3"><i className="size-4 rounded-full bg-[#63dc91]"/><i className="size-4 rounded-full bg-[#34c66d]"/><i className="size-4 rounded-full bg-[#16a34a]"/></div>
  </div>;
}
