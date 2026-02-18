"use client"

import { emitMitraEvent } from "@/lib/mitra-analytics"

interface TicketConfirmProps {
  onConfirm: () => void
  onDismiss: () => void
  disabled?: boolean
}

export function TicketConfirm({ onConfirm, onDismiss, disabled }: TicketConfirmProps) {
  const handleConfirm = () => {
    emitMitraEvent("ticket_requested")
    onConfirm()
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        onClick={handleConfirm}
        disabled={disabled}
        className="min-h-[44px] rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        aria-label="Yes, raise a support ticket"
      >
        {"Yes \u2014 raise ticket"}
      </button>
      <button
        onClick={onDismiss}
        disabled={disabled}
        className="min-h-[44px] rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        aria-label="Not now, dismiss ticket"
      >
        Not now
      </button>
    </div>
  )
}
