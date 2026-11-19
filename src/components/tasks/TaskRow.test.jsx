import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import TaskRow from '@/components/tasks/TaskRow'

const BASE_TASK = {
  id: 1,
  project_id: 2,
  title: 'Estudar React',
  description: 'Revisar hooks e composição.',
  status: 'todo',
  priority: 'high',
  due_date: null,
  completed_at: null,
}

describe('TaskRow', () => {
  it('shows status and priority badges', () => {
    render(
      <TaskRow
        task={BASE_TASK}
        onEdit={() => {}}
        onDelete={() => {}}
        onCycleStatus={() => {}}
      />,
    )

    expect(screen.getByText('Estudar React')).toBeInTheDocument()
    expect(screen.getByText('A fazer')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
  })

  it('cycles the status when the circle button is clicked', async () => {
    const onCycleStatus = vi.fn()
    const user = userEvent.setup()

    render(
      <TaskRow
        task={BASE_TASK}
        onEdit={() => {}}
        onDelete={() => {}}
        onCycleStatus={onCycleStatus}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: /marcar "estudar react" como em andamento/i }),
    )

    expect(onCycleStatus).toHaveBeenCalledWith(BASE_TASK)
  })

  it('marks completed tasks visually', () => {
    render(
      <TaskRow
        task={{ ...BASE_TASK, status: 'done' }}
        onEdit={() => {}}
        onDelete={() => {}}
        onCycleStatus={() => {}}
      />,
    )

    expect(screen.getByText('Estudar React')).toHaveClass('line-through')
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })
})
