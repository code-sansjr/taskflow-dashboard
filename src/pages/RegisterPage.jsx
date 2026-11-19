import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import AuthLayout from '@/components/layout/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/auth-context'
import { validateRegister } from '@/lib/validation'

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
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
    const nextErrors = validateRegister(form)

    setErrors(nextErrors)
    setGeneralError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/', { replace: true })
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
        setGeneralError(error.message ?? 'Não foi possível criar a conta. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Leva menos de um minuto. Depois é só criar o primeiro projeto."
      footer={
        <p>
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-sky-400 transition hover:text-sky-300">
            Entrar
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
          label="Nome"
          name="name"
          autoComplete="name"
          placeholder="Como você quer ser chamado"
          value={form.name}
          onChange={updateField('name')}
          error={errors.name}
        />

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
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
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

        <Input
          label="Confirmar senha"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          error={errors.confirmPassword}
        />

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  )
}
