import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Modal from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders an accessible dialog and focuses the first field', async () => {
    render(
      <Modal open onClose={() => {}} title="Novo projeto">
        <label htmlFor="name">Nome</label>
        <input id="name" />
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Novo projeto')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toHaveFocus()
    })
  })

  it('closes when Escape is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal open onClose={onClose} title="Confirmar">
        <button type="button">Ação</button>
      </Modal>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Fechado">
        <p>Conteúdo</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
