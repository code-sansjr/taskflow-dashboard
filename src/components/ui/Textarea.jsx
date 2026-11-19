import { cn } from '@/lib/cn'
import { fieldClasses, fieldErrorClasses } from '@/components/ui/field-styles'

export default function Textarea({ label, error, hint, id, className, rows = 3, ...props }) {
  const textareaId = id ?? props.name
  const messageId = `${textareaId}-message`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(fieldClasses, 'resize-y', error && fieldErrorClasses, className)}
        {...props}
      />

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
