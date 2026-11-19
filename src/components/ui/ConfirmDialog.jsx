import { CircleAlert } from 'lucide-react'

import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Remover',
  pending = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
          <CircleAlert className="h-5 w-5" />
        </span>
        <div className="space-y-1 text-sm leading-6 text-slate-300">{children}</div>
      </div>
    </Modal>
  )
}
