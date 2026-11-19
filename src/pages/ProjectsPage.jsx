import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderKanban, Plus } from 'lucide-react'

import ProjectCard from '@/components/projects/ProjectCard'
import ProjectFormModal from '@/components/projects/ProjectFormModal'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import PageHeader from '@/components/ui/PageHeader'
import Pagination from '@/components/ui/Pagination'
import Skeleton from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast-context'
import { api } from '@/lib/api'
import { PROJECTS_PER_PAGE } from '@/lib/constants'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(() => Boolean(location.state?.create))
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)

  const projectsQuery = useQuery({
    queryKey: ['projects', { page }],
    queryFn: () => api.projects.list({ page, per_page: PROJECTS_PER_PAGE }),
  })

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMutation = useMutation({
    mutationFn: (data) => api.projects.create(data),
    onSuccess: () => {
      toast.success('Projeto criado com sucesso.')
      invalidateLists()
      setPage(1)
      setFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.projects.update(id, data),
    onSuccess: (project) => {
      toast.success('Projeto atualizado.')
      invalidateLists()
      queryClient.invalidateQueries({ queryKey: ['project', project.id] })
      setFormOpen(false)
      setEditingProject(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.projects.remove(id),
    onSuccess: () => {
      toast.success('Projeto removido.')
      invalidateLists()
      if (page > 1 && (projectsQuery.data?.data.length ?? 0) === 1) {
        setPage((current) => current - 1)
      }
      setDeletingProject(null)
    },
    onError: (error) => {
      toast.error(error.message ?? 'Não foi possível remover o projeto.')
    },
  })

  useEffect(() => {
    if (location.state?.create) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const openCreate = () => {
    setEditingProject(null)
    setFormOpen(true)
  }

  const openEdit = (project) => {
    setEditingProject(project)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return
    }

    setFormOpen(false)
    setEditingProject(null)
  }

  const handleSubmit = (data) => {
    if (editingProject) {
      return updateMutation.mutateAsync({ id: editingProject.id, data })
    }

    return createMutation.mutateAsync(data)
  }

  const projects = projectsQuery.data?.data ?? []
  const meta = projectsQuery.data?.meta

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        eyebrow="Projetos"
        title="Seus projetos"
        description="Organize frentes de trabalho, acompanhe o progresso e abra cada projeto para cuidar das tarefas."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Novo projeto
          </Button>
        }
      />

      {projectsQuery.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : projectsQuery.isError ? (
        <ErrorState
          title="Não foi possível carregar os projetos"
          message={projectsQuery.error?.message}
          onRetry={() => projectsQuery.refetch()}
        />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto ainda"
          description="Crie seu primeiro projeto para começar a organizar tarefas, prazos e prioridades."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Criar primeiro projeto
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={openEdit}
                onDelete={setDeletingProject}
              />
            ))}
          </div>

          <Pagination
            meta={meta}
            onPageChange={setPage}
            isFetching={projectsQuery.isFetching}
          />
        </>
      )}

      {formOpen && (
        <ProjectFormModal
          open={formOpen}
          onClose={closeForm}
          project={editingProject}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => deleteMutation.mutate(deletingProject.id)}
        title="Remover projeto"
        pending={deleteMutation.isPending}
        confirmLabel="Remover projeto"
      >
        <p>
          O projeto <strong className="text-white">{deletingProject?.name}</strong> e todas as
          tarefas vinculadas serão removidos. Essa ação não pode ser desfeita.
        </p>
      </ConfirmDialog>
    </div>
  )
}
