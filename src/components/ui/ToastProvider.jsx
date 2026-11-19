import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'

import { ToastContext } from '@/components/ui/toast-context'
import { cn } from '@/lib/cn'

const TOAST_DURATION = 4500

let nextToastId = 1

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = nextToastId
      nextToastId += 1

      setToasts((current) => [...current, { id, type, message }])
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), TOAST_DURATION),
      )
    },
    [dismiss],
  )

  useEffect(() => {
    const activeTimers = timers.current

    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer))
      activeTimers.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
        role="region"
        aria-label="Notificações"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl shadow-black/40 backdrop-blur',
              toast.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100'
                : 'border-rose-500/30 bg-rose-950/90 text-rose-100',
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
            )}

            <p className="flex-1 leading-5">{toast.message}</p>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-md p-0.5 text-current/70 transition hover:bg-white/10 hover:text-current"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
