import { Loader2 } from 'lucide-react'

import Brand from '@/components/ui/Brand'
import { cn } from '@/lib/cn'

export function Spinner({ className }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-sky-400', className)} aria-hidden="true" />
}

export default function LoadingScreen({ label = 'Carregando…' }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
      <Brand />
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Spinner />
        <span>{label}</span>
      </div>
    </div>
  )
}
