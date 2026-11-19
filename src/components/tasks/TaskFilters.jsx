import { Clock, Search, X } from 'lucide-react'

import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants'
import { cn } from '@/lib/cn'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  ...Object.entries(TASK_STATUS).map(([value, meta]) => ({ value, label: meta.label })),
]

export default function TaskFilters({ filters, onChange, onClear }) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.overdue ||
    filters.search.trim() !== ''

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-950/50 p-1"
          role="group"
          aria-label="Filtrar por status"
        >
          {STATUS_OPTIONS.map((option) => {
            const active = filters.status === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ status: option.value })}
                aria-pressed={active}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                  active
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="priority-filter">
            Filtrar por prioridade
          </label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(event) => onChange({ priority: event.target.value })}
            className="h-9 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">Todas as prioridades</option>
            {Object.entries(TASK_PRIORITY).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onChange({ overdue: !filters.overdue })}
            aria-pressed={filters.overdue}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition',
              filters.overdue
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200',
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            Atrasadas
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-slate-400 transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor="task-search">
          Buscar tarefas
        </label>
        <input
          id="task-search"
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Buscar tarefas pelo título…"
          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ search: '' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
