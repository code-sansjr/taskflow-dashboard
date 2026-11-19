import { Inbox } from 'lucide-react'

import { cn } from '@/lib/cn'

export default function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/70 text-slate-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>

      {description && (
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
