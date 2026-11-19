import { useState } from 'react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { validateProject } from '@/lib/validation'

export default function ProjectFormModal({ open, onClose, project, onSubmit }) {
  const [form, setForm] = useState(() => ({
    name: project?.name ?? '',
    description: project?.description ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setGeneralError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateProject(form)

    setErrors(nextErrors)
    setGeneralError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim() || null,
      })
      onClose()
    } catch (error) {
      const fieldErrors = error.fieldErrors ?? {}
      const mappedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [
          field,
          Array.isArray(messages) ? messages[0] : messages,
        ]),
      )

      if (Object.keys(mappedErrors).length > 0) {
        setErrors(mappedErrors)
      } else {
        setGeneralError(error.message ?? 'Não foi possível salvar o projeto.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? 'Editar projeto' : 'Novo projeto'}
      description={
        project
          ? 'Atualize o nome ou a descrição do projeto.'
          : 'Crie um espaço para organizar tarefas relacionadas.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="project-form" loading={submitting}>
            {project ? 'Salvar alterações' : 'Criar projeto'}
          </Button>
        </>
      }
    >
      <form id="project-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
        {generalError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
          >
            {generalError}
          </div>
        )}

        <Input
          label="Nome do projeto"
          name="name"
          placeholder="Ex.: Portfólio profissional"
          value={form.name}
          onChange={updateField('name')}
          error={errors.name}
          maxLength={120}
        />

        <Textarea
          label="Descrição"
          name="description"
          placeholder="Opcional: contexto, objetivo ou escopo do projeto."
          value={form.description}
          onChange={updateField('description')}
          error={errors.description}
          maxLength={2000}
          rows={4}
        />
      </form>
    </Modal>
  )
}
