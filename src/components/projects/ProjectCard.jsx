import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Pencil, Trash2 } from 'lucide-react'

import ProgressBar from '@/components/ui/ProgressBar'
import { formatDate } from '@/lib/format'

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 transition hover:border-sky-500/30 hover:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/projects/${project.id}`}
            className="block truncate text-base font-semibold text-white transition hover:text-sky-300"
          >
            {project.name}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Criado em {formatDate(project.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-sky-300"
            aria-label={`Editar ${project.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-rose-300"
            aria-label={`Remover ${project.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
        {project.description || 'Sem descrição.'}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            {project.tasks_done} de {project.tasks_total} tarefas
          </span>
          <span className="font-semibold text-slate-300">{project.progress}%</span>
        </div>

        <ProgressBar
          value={project.progress}
          tone={project.progress === 100 ? 'emerald' : 'sky'}
          className="mt-2"
          label={`Progresso de ${project.name}`}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-4">
        <span className="text-xs text-slate-500">{project.tasks_pending} pendentes</span>

        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 transition hover:text-sky-300"
        >
          Abrir
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
