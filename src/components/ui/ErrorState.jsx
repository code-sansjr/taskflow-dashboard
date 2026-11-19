import { RefreshCw, TriangleAlert } from 'lucide-react'

import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export default function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Ocorreu um erro ao consultar a API. Tente novamente.',
  onRetry,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-12 text-center',
        className,
      )}
      role="alert"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">{message}</p>

      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
