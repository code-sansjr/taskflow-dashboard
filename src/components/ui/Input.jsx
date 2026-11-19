import { cn } from '@/lib/cn'
import { fieldClasses, fieldErrorClasses } from '@/components/ui/field-styles'

export default function Input({ label, error, hint, id, className, trailing, ...props }) {
  const inputId = id ?? props.name
  const messageId = `${inputId}-message`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            fieldClasses,
            trailing && 'pr-11',
            error && fieldErrorClasses,
            className,
          )}
          {...props}
        />

        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">{trailing}</div>
        )}
      </div>

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
