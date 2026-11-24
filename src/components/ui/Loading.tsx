import { LoaderPinwheel } from 'lucide-react'

export default function LoadingCom() {
  return (
    <div className='absolute top-0 bottom-0 right-0 left-0 z-700 flex items-center justify-center text-black'>
         <LoaderPinwheel size={150} className='animate-spin' />

    </div>
  )
}
