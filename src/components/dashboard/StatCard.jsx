import { cn } from '@/lib/cn'

const TONES = {
  sky: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
  amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  slate: 'bg-slate-500/10 text-slate-300 ring-slate-500/20',
}

const numberFormatter = new Intl.NumberFormat('pt-BR')

export default function StatCard({ label, value, hint, icon: Icon, tone = 'slate' }) {
  return (
    <article className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {numberFormatter.format(Number(value) || 0)}
          </p>
          {hint && <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}
        </div>

        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
            TONES[tone],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}
