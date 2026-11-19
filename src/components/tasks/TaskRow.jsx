import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import { NEXT_STATUS, TASK_PRIORITY, TASK_STATUS } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { formatDate, isOverdue } from '@/lib/format'

export default function TaskRow({ task, onEdit, onDelete, onCycleStatus, isUpdating }) {
  const status = TASK_STATUS[task.status]
  const priority = TASK_PRIORITY[task.priority]
  const overdue = isOverdue(task.due_date, task.status)
  const nextStatus = TASK_STATUS[NEXT_STATUS[task.status]]

  return (
    <article
      className={cn(
        'group flex gap-3 rounded-xl border border-slate-800/70 bg-slate-900/40 p-4 transition hover:border-slate-700',
        isUpdating && 'opacity-60',
      )}
      aria-busy={isUpdating || undefined}
    >
      <button
        type="button"
        onClick={() => onCycleStatus(task)}
        disabled={isUpdating}
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70',
          task.status === 'done'
            ? 'border-emerald-400 bg-emerald-400 text-slate-950'
            : 'border-slate-600 text-transparent hover:border-sky-400',
        )}
        title={`Marcar como ${nextStatus.label.toLowerCase()}`}
        aria-label={`Marcar "${task.title}" como ${nextStatus.label.toLowerCase()}`}
      >
        {task.status === 'done' ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <span className={cn('h-2.5 w-2.5 rounded-full', status.dot)} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'text-sm font-medium leading-5',
              task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100',
            )}
          >
            {task.title}
          </p>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-sky-300"
              aria-label={`Editar ${task.title}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-rose-300"
              aria-label={`Remover ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge className={status.badge}>{status.label}</Badge>
          <Badge className={priority.badge}>{priority.label}</Badge>

          {task.due_date && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs',
                overdue ? 'font-medium text-rose-400' : 'text-slate-500',
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(task.due_date)}
              {overdue && <span className="text-rose-400">· atrasada</span>}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
