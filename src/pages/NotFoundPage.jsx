import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

import Brand from '@/components/ui/Brand'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <Brand />

      <span className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/70 text-sky-300">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
        Erro 404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>

      <Button as={Link} to="/" className="mt-7">
        Voltar para o dashboard
      </Button>
    </div>
  )
}
