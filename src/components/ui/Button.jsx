import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'

const VARIANTS = {
  primary:
    'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400 active:bg-sky-300',
  secondary:
    'bg-slate-800 text-slate-100 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 active:bg-slate-600',
  ghost: 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
  danger:
    'bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-500/30 hover:bg-rose-500/20 hover:text-rose-200',
}

const SIZES = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type,
  ...props
}) {
  const isButton = Component === 'button'

  return (
    <Component
      {...(isButton ? { type: type ?? 'button' } : {})}
      disabled={isButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  )
}
