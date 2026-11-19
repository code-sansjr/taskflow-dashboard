import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ArrowLeft, FolderKanban, ListTodo, Pencil, Plus, Trash2 } from 'lucide-react'

import ProjectFormModal from '@/components/projects/ProjectFormModal'
import TaskFilters from '@/components/tasks/TaskFilters'
import TaskFormModal from '@/components/tasks/TaskFormModal'
import TaskRow from '@/components/tasks/TaskRow'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import PageHeader from '@/components/ui/PageHeader'
import Pagination from '@/components/ui/Pagination'
import ProgressBar from '@/components/ui/ProgressBar'
import Skeleton from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast-context'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { NEXT_STATUS, TASKS_PER_PAGE, TASK_STATUS } from '@/lib/constants'

const INITIAL_FILTERS = {
  status: 'all',
  priority: 'all',
  overdue: false,
  search: '',
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-28" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-28" />
      <Skeleton className="h-12" />
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-20" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const id = Number(projectId)
  const isValidId = Number.isInteger(id) && id > 0

  const queryClient = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(filters.search)

  const [projectFormOpen, setProjectFormOpen] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  const projectQuery = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.projects.get(id),
    enabled: isValidId,
  })

  const taskParams = {
    status: filters.status === 'all' ? undefined : filters.status,
    priority: filters.priority === 'all' ? undefined : filters.priority,
    overdue: filters.overdue ? true : undefined,
    search: debouncedSearch || undefined,
    page,
    per_page: TASKS_PER_PAGE,
  }

  const tasksQuery = useQuery({
    queryKey: ['tasks', id, taskParams],
    queryFn: () => api.tasks.list(id, taskParams),
    enabled: isValidId,
    placeholderData: keepPreviousData,
  })

  const invalidateProjectData = () => {
    queryClient.invalidateQueries({ queryKey: ['project', id] })
    queryClient.invalidateQueries({ queryKey: ['tasks', id] })
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createTaskMutation = useMutation({
    mutationFn: (data) => api.tasks.create(id, data),
    onSuccess: () => {
      toast.success('Tarefa criada.')
      invalidateProjectData()
      setTaskFormOpen(false)
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }) => api.tasks.update(taskId, data),
    onSuccess: () => {
      toast.success('Tarefa atualizada.')
      invalidateProjectData()
      setTaskFormOpen(false)
      setEditingTask(null)
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => api.tasks.remove(taskId),
    onSuccess: () => {
      toast.success('Tarefa removida.')
      invalidateProjectData()
      if (page > 1 && (tasksQuery.data?.data.length ?? 0) === 1) {
        setPage((current) => current - 1)
      }
      setDeletingTask(null)
    },
    onError: (error) => toast.error(error.message ?? 'Não foi possível remover a tarefa.'),
  })

  const statusMutation = useMutation({
    mutationFn: (task) => api.tasks.update(task.id, { status: NEXT_STATUS[task.status] }),
    onSuccess: (task) => {
      toast.success(`Status alterado para ${TASK_STATUS[task.status].label.toLowerCase()}.`)
      invalidateProjectData()
    },
    onError: (error) => toast.error(error.message ?? 'Não foi possível alterar o status.'),
  })

  const updateProjectMutation = useMutation({
    mutationFn: (data) => api.projects.update(id, data),
    onSuccess: () => {
      toast.success('Projeto atualizado.')
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setProjectFormOpen(false)
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: () => api.projects.remove(id),
    onSuccess: () => {
      toast.success('Projeto removido.')
      queryClient.removeQueries({ queryKey: ['project', id] })
      queryClient.removeQueries({ queryKey: ['tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate('/projects', { replace: true })
    },
    onError: (error) => toast.error(error.message ?? 'Não foi possível remover o projeto.'),
  })

  const changeFilters = (patch) => {
    setFilters((current) => ({ ...current, ...patch }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const openCreateTask = () => {
    setEditingTask(null)
    setTaskFormOpen(true)
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  const closeTaskForm = () => {
    if (createTaskMutation.isPending || updateTaskMutation.isPending) {
      return
    }

    setTaskFormOpen(false)
    setEditingTask(null)
  }

  if (!isValidId) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Projeto não encontrado"
        description="O endereço acessado não corresponde a um projeto válido."
        action={
          <Button as={Link} to="/projects" variant="secondary">
            Voltar para projetos
          </Button>
        }
      />
    )
  }

  if (projectQuery.isPending) {
    return <DetailSkeleton />
  }

  if (projectQuery.isError) {
    if (projectQuery.error?.status === 404) {
      return (
        <EmptyState
          icon={FolderKanban}
          title="Projeto não encontrado"
          description="Ele pode ter sido removido ou pertence a outra conta."
          action={
            <Button as={Link} to="/projects" variant="secondary">
              Voltar para projetos
            </Button>
          }
        />
      )
    }

    return (
      <ErrorState
        title="Não foi possível carregar o projeto"
        message={projectQuery.error?.message}
        onRetry={() => projectQuery.refetch()}
      />
    )
  }

  const project = projectQuery.data
  const tasks = tasksQuery.data?.data ?? []
  const meta = tasksQuery.data?.meta
  const hasFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.overdue ||
    filters.search.trim() !== ''

  return (
    <div className="animate-fade-up space-y-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para projetos
      </Link>

      <PageHeader
        eyebrow="Projeto"
        title={project.name}
        description={project.description || 'Sem descrição.'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setProjectFormOpen(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="danger" onClick={() => setDeleteProjectOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Remover
            </Button>
          </>
        }
      />

      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-white">{project.progress}%</p>
            <p className="text-sm text-slate-400">concluído</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <span className="text-slate-400">
              <strong className="text-white">{project.tasks_total}</strong> tarefas
            </span>
            <span className="text-emerald-300">
              <strong>{project.tasks_done}</strong> concluídas
            </span>
            <span className="text-amber-300">
              <strong>{project.tasks_pending}</strong> pendentes
            </span>
          </div>
        </div>

        <ProgressBar
          value={project.progress}
          tone={project.progress === 100 ? 'emerald' : 'sky'}
          className="mt-4"
          label={`Progresso de ${project.name}`}
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Tarefas</h2>
            <p className="text-sm text-slate-400">
              {meta?.total ?? 0} {meta?.total === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
            </p>
          </div>

          <Button onClick={openCreateTask}>
            <Plus className="h-4 w-4" />
            Nova tarefa
          </Button>
        </div>

        <TaskFilters filters={filters} onChange={changeFilters} onClear={clearFilters} />

        {tasksQuery.isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
        ) : tasksQuery.isError ? (
          <ErrorState
            title="Não foi possível carregar as tarefas"
            message={tasksQuery.error?.message}
            onRetry={() => tasksQuery.refetch()}
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={hasFilters ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}
            description={
              hasFilters
                ? 'Ajuste os filtros para ver outras tarefas deste projeto.'
                : 'Crie a primeira tarefa deste projeto e comece a acompanhar o progresso.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : (
                <Button onClick={openCreateTask}>
                  <Plus className="h-4 w-4" />
                  Criar tarefa
                </Button>
              )
            }
          />
        ) : (
          <div
            className={cn(
              'space-y-2 transition-opacity',
              tasksQuery.isFetching && 'opacity-60',
            )}
          >
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={openEditTask}
                onDelete={setDeletingTask}
                onCycleStatus={(currentTask) => statusMutation.mutate(currentTask)}
                isUpdating={
                  statusMutation.isPending &&
                  statusMutation.variables?.id === task.id
                }
              />
            ))}
          </div>
        )}

        <Pagination
          meta={meta}
          onPageChange={setPage}
          isFetching={tasksQuery.isFetching}
        />
      </section>

      {projectFormOpen && (
        <ProjectFormModal
          open={projectFormOpen}
          onClose={() => {
            if (!updateProjectMutation.isPending) {
              setProjectFormOpen(false)
            }
          }}
          project={project}
          onSubmit={(data) => updateProjectMutation.mutateAsync(data)}
        />
      )}

      {taskFormOpen && (
        <TaskFormModal
          open={taskFormOpen}
          onClose={closeTaskForm}
          task={editingTask}
          onSubmit={(data) =>
            editingTask
              ? updateTaskMutation.mutateAsync({ taskId: editingTask.id, data })
              : createTaskMutation.mutateAsync(data)
          }
        />
      )}

      <ConfirmDialog
        open={deleteProjectOpen}
        onClose={() => setDeleteProjectOpen(false)}
        onConfirm={() => deleteProjectMutation.mutate()}
        title="Remover projeto"
        pending={deleteProjectMutation.isPending}
        confirmLabel="Remover projeto"
      >
        <p>
          O projeto <strong className="text-white">{project.name}</strong> e todas as tarefas
          vinculadas serão removidos. Essa ação não pode ser desfeita.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => deleteTaskMutation.mutate(deletingTask.id)}
        title="Remover tarefa"
        pending={deleteTaskMutation.isPending}
        confirmLabel="Remover tarefa"
      >
        <p>
          A tarefa <strong className="text-white">{deletingTask?.title}</strong> será removida
          permanentemente.
        </p>
      </ConfirmDialog>
    </div>
  )
}
