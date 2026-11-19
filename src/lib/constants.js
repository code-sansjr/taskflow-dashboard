export const TASK_STATUS = {
  todo: {
    label: 'A fazer',
    dot: 'bg-slate-400',
    badge: 'bg-slate-500/10 text-slate-300 ring-slate-500/20',
  },
  doing: {
    label: 'Em andamento',
    dot: 'bg-sky-400',
    badge: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
  },
  done: {
    label: 'Concluída',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  },
}

export const TASK_PRIORITY = {
  low: {
    label: 'Baixa',
    badge: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  },
  medium: {
    label: 'Média',
    badge: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  },
  high: {
    label: 'Alta',
    badge: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
  },
}

export const NEXT_STATUS = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}

export const STATUS_ORDER = ['todo', 'doing', 'done']

export const PROJECTS_PER_PAGE = 9
export const TASKS_PER_PAGE = 10
