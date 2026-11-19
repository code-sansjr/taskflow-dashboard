import { useState } from 'react'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants'
import { validateTask } from '@/lib/validation'

export default function TaskFormModal({ open, onClose, task, onSubmit }) {
  const [form, setForm] = useState(() => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    dueDate: task?.due_date ?? '',
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
    const nextErrors = validateTask(form)

    setErrors(nextErrors)
    setGeneralError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        due_date: form.dueDate || null,
      })
      onClose()
    } catch (error) {
      const fieldErrors = error.fieldErrors ?? {}
      const mappedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [
          field === 'due_date' ? 'dueDate' : field,
          Array.isArray(messages) ? messages[0] : messages,
        ]),
      )

      if (Object.keys(mappedErrors).length > 0) {
        setErrors(mappedErrors)
      } else {
        setGeneralError(error.message ?? 'Não foi possível salvar a tarefa.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? 'Editar tarefa' : 'Nova tarefa'}
      description={
        task
          ? 'Atualize os detalhes, o prazo ou o andamento da tarefa.'
          : 'Adicione uma tarefa ao projeto e defina prazo e prioridade.'
      }
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" form="task-form" loading={submitting}>
            {task ? 'Salvar alterações' : 'Criar tarefa'}
          </Button>
        </>
      }
    >
      <form id="task-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
        {generalError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
          >
            {generalError}
          </div>
        )}

        <Input
          label="Título"
          name="title"
          placeholder="Ex.: Revisar autenticação da API"
          value={form.title}
          onChange={updateField('title')}
          error={errors.title}
          maxLength={180}
        />

        <Textarea
          label="Descrição"
          name="description"
          placeholder="Opcional: detalhes, critérios de aceite ou links."
          value={form.description}
          onChange={updateField('description')}
          error={errors.description}
          maxLength={5000}
          rows={4}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={updateField('status')}
            error={errors.status}
          >
            {Object.entries(TASK_STATUS).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>

          <Select
            label="Prioridade"
            name="priority"
            value={form.priority}
            onChange={updateField('priority')}
            error={errors.priority}
          >
            {Object.entries(TASK_PRIORITY).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Prazo"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={updateField('dueDate')}
          error={errors.dueDate}
          hint="Opcional. Tarefas atrasadas aparecem destacadas no dashboard."
        />
      </form>
    </Modal>
  )
}
