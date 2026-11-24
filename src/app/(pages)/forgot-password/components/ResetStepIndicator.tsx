import { Check, KeyRound, LockKeyhole, Mail } from "lucide-react";

export default function ResetStepIndicator({ step }: { step: number }) {
  const icons = [Mail, KeyRound, LockKeyhole];
  return <div className="mx-auto mt-7 flex max-w-[360px] items-center justify-center" aria-label={`Step ${step} of 3`}>
    {icons.map((Icon, index) => <div className="contents" key={index}>
      {index > 0 && <span className={`h-[2px] flex-1 ${step >= index + 1 ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />}
      <span className={`flex size-[50px] shrink-0 items-center justify-center rounded-full ${step > index + 1 ? "bg-[#16a34a] text-white" : step === index + 1 ? "bg-[#16a34a] text-white ring-[6px] ring-[#dcfce7]" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
        {step > index + 1 ? <Check size={20} /> : <Icon size={18} fill={index === 0 && step === 1 ? "currentColor" : "none"} />}
      </span>
    </div>)}
  </div>;
}
