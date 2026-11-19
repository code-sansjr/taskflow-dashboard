import { cn } from '@/lib/cn'
import { fieldClasses, fieldErrorClasses } from '@/components/ui/field-styles'

export default function Select({ label, error, hint, id, className, children, ...props }) {
  const selectId = id ?? props.name
  const messageId = `${selectId}-message`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(fieldClasses, 'appearance-none', error && fieldErrorClasses, className)}
        {...props}
      >
        {children}
      </select>

      {error ? (
        <p id={messageId} className="text-xs text-rose-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
