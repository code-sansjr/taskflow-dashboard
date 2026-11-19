import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  CircleCheckBig,
  FolderKanban,
  ListTodo,
  Plus,
  TriangleAlert,
} from 'lucide-react'

import ProgressRing from '@/components/dashboard/ProgressRing'
import StatCard from '@/components/dashboard/StatCard'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import PageHeader from '@/components/ui/PageHeader'
import ProgressBar from '@/components/ui/ProgressBar'
import Skeleton from '@/components/ui/Skeleton'
import { TASK_STATUS } from '@/lib/constants'
import { api } from '@/lib/api'

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80" />
        <Skeleton className="h-80 lg:col-span-2" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.dashboard.get,
  })

  const projectsQuery = useQuery({
    queryKey: ['projects', { page: 1, per_page: 5 }],
    queryFn: () => api.projects.list({ page: 1, per_page: 5 }),
  })

  if (dashboardQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o dashboard"
        message={dashboardQuery.error?.message}
        onRetry={() => dashboardQuery.refetch()}
      />
    )
  }

  const dashboard = dashboardQuery.data
  const tasks = dashboard.tasks
  const completion = Math.round(Number(dashboard.completion_rate) || 0)
  const recentProjects = projectsQuery.data?.data ?? []

  const statusRows = [
    { key: 'todo', count: tasks.todo },
    { key: 'doing', count: tasks.doing },
    { key: 'done', count: tasks.done },
  ]

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Visão geral"
        description="Acompanhe o andamento dos seus projetos, prazos e tarefas em um só lugar."
        actions={
          <Button onClick={() => navigate('/projects', { state: { create: true } })}>
            <Plus className="h-4 w-4" />
            Novo projeto
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo">
        <StatCard
          label="Projetos"
          value={dashboard.projects}
          hint="espaços de trabalho ativos"
          icon={FolderKanban}
          tone="sky"
        />
        <StatCard
          label="Tarefas"
          value={tasks.total}
          hint={`${tasks.todo} a fazer · ${tasks.doing} em andamento`}
          icon={ListTodo}
          tone="slate"
        />
        <StatCard
          label="Concluídas"
          value={tasks.done}
          hint={`${completion}% de conclusão`}
          icon={CircleCheckBig}
          tone="emerald"
        />
        <StatCard
          label="Atrasadas"
          value={tasks.overdue}
          hint={`${tasks.due_today} com prazo para hoje`}
          icon={TriangleAlert}
          tone="rose"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <h2 className="text-base font-semibold text-white">Taxa de conclusão</h2>
          <p className="mt-1 text-sm text-slate-400">
            Proporção de tarefas concluídas em todos os projetos.
          </p>

          <div className="mt-5 flex flex-col items-center gap-6">
            <ProgressRing value={completion} />

            <div className="w-full space-y-3">
              {statusRows.map(({ key, count }) => (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${TASK_STATUS[key].dot}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-slate-400">{TASK_STATUS[key].label}</span>
                  <span className="font-semibold text-slate-200">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Projetos recentes</h2>
              <p className="mt-1 text-sm text-slate-400">
                Últimos projetos criados e o progresso de cada um.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5">
            {projectsQuery.isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-20" />
                ))}
              </div>
            ) : projectsQuery.isError ? (
              <ErrorState
                className="border-0 bg-transparent px-0 py-8"
                title="Não foi possível carregar os projetos"
                message={projectsQuery.error?.message}
                onRetry={() => projectsQuery.refetch()}
              />
            ) : recentProjects.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="Nenhum projeto ainda"
                description="Crie seu primeiro projeto para começar a organizar suas tarefas."
                action={
                  <Button
                    size="sm"
                    onClick={() => navigate('/projects', { state: { create: true } })}
                  >
                    <Plus className="h-4 w-4" />
                    Criar projeto
                  </Button>
                }
                className="border-0 bg-transparent px-0 py-6"
              />
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="group block rounded-xl border border-slate-800/70 bg-slate-950/30 p-4 transition hover:border-sky-500/30 hover:bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-slate-100 transition group-hover:text-sky-300">
                        {project.name}
                      </p>
                      <span className="shrink-0 text-xs text-slate-500">
                        {project.tasks_done}/{project.tasks_total} tarefas
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar
                        value={project.progress}
                        tone={project.progress === 100 ? 'emerald' : 'sky'}
                        label={`Progresso de ${project.name}`}
                      />
                      <span className="w-10 shrink-0 text-right text-xs font-medium text-slate-400">
                        {project.progress}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
