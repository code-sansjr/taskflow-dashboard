import { Check } from 'lucide-react'

import { cn } from '@/lib/cn'

export default function Brand({ compact = false, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-lg shadow-sky-500/20">
        <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
      </span>

      {!compact && (
        <span className="min-w-0">
          <span className="block text-lg font-bold leading-tight text-white">TaskFlow</span>
          <span className="block truncate text-xs text-slate-500">Gestão de projetos</span>
        </span>
      )}
    </div>
  )
}
