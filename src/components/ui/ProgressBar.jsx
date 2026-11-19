import { cn } from '@/lib/cn'

const TONES = {
  sky: 'bg-gradient-to-r from-sky-500 to-cyan-400',
  emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
}

export default function ProgressBar({ value, tone = 'sky', className, label }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-800', className)}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progresso'}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', TONES[tone])}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}
