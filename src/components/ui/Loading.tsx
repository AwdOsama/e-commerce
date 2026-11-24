import { LoaderPinwheel } from 'lucide-react'

export default function LoadingCom() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[55vh] w-full flex-1 items-center justify-center bg-background py-16 text-primary"
    >
      <LoaderPinwheel size={48} strokeWidth={1.8} className="animate-spin" />
    </div>
  )
}
