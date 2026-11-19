import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/auth-context'
import { validateLogin } from '@/lib/validation'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setGeneralError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateLogin(form)

    setErrors(nextErrors)
    setGeneralError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      if (error.status === 401) {
        setGeneralError('E-mail ou senha inválidos.')
      } else {
        setGeneralError(error.message ?? 'Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar na sua conta"
      subtitle="Acesse o painel para acompanhar projetos, prazos e tarefas."
      footer={
        <p>
          Ainda não tem conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-sky-400 transition hover:text-sky-300"
          >
            Criar conta
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {generalError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
          >
            {generalError}
          </div>
        )}

        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={form.email}
          onChange={updateField('email')}
          error={errors.email}
        />

        <Input
          label="Senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Sua senha"
          value={form.password}
          onChange={updateField('password')}
          error={errors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  )
}
