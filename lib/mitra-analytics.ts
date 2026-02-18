type MitraEvent =
  | "message_sent"
  | "chip_clicked"
  | "link_clicked"
  | "ticket_requested"
  | "ticket_confirmed"
  | "error_retry"

interface MitraEventPayload {
  event: MitraEvent
  timestamp: string
  intent?: string
}

export function emitMitraEvent(event: MitraEvent, intent?: string) {
  const payload: MitraEventPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...(intent && { intent }),
  }

  // In production, send to analytics endpoint
  // For now, log to console for development
  if (typeof window !== "undefined") {
    console.log("[Mitra Analytics]", payload)

    // Dispatch custom event for external listeners
    window.dispatchEvent(
      new CustomEvent("mitra:analytics", { detail: payload })
    )
  }
}
