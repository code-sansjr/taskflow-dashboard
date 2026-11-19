import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/cn'

function pageWindow(current, lastPage) {
  const start = Math.max(1, Math.min(current - 2, lastPage - 4))
  const end = Math.min(lastPage, start + 4)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export default function Pagination({ meta, onPageChange, isFetching = false }) {
  if (!meta || meta.last_page <= 1) {
    return null
  }

  const pages = pageWindow(meta.page, meta.last_page)

  const goTo = (page) => {
    if (page >= 1 && page <= meta.last_page && page !== meta.page) {
      onPageChange(page)
    }
  }

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-slate-800/80 pt-4 sm:flex-row"
      aria-label="Paginação"
    >
      <p className="text-xs text-slate-500">
        Página {meta.page} de {meta.last_page} · {meta.total}{' '}
        {meta.total === 1 ? 'item' : 'itens'}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(meta.page - 1)}
          disabled={meta.page === 1 || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goTo(page)}
              disabled={isFetching}
              aria-current={page === meta.page ? 'page' : undefined}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition',
                page === meta.page
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(meta.page + 1)}
          disabled={meta.page === meta.last_page || isFetching}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
