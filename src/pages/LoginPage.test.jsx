import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  user: null,
  initializing: false,
}))

vi.mock('@/context/auth-context', () => ({
  useAuth: () => auth,
}))

import LoginPage from '@/pages/LoginPage'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div>Dashboard autenticado</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    auth.login.mockReset()
    auth.login.mockResolvedValue({ id: 1, name: 'Sandro', email: 'sandro@example.com' })
  })

  it('submits the credentials and navigates to the dashboard', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('E-mail'), 'sandro@example.com')
    await user.type(screen.getByLabelText('Senha'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(auth.login).toHaveBeenCalledWith({
      email: 'sandro@example.com',
      password: 'secret123',
    })
    expect(await screen.findByText('Dashboard autenticado')).toBeInTheDocument()
  })

  it('shows validation errors and does not call the API', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument()
    expect(auth.login).not.toHaveBeenCalled()
  })

  it('shows a friendly message for invalid credentials', async () => {
    const user = userEvent.setup()
    auth.login.mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }))

    renderLogin()

    await user.type(screen.getByLabelText('E-mail'), 'sandro@example.com')
    await user.type(screen.getByLabelText('Senha'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument()
  })
})
