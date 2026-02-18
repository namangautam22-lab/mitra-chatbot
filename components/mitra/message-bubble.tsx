"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { ChatMessage, ChipOption, DocumentItem } from "@/lib/mitra-types"
import { TrackingCard } from "./tracking-card"
import { TicketConfirm } from "./ticket-confirm"
import { DocumentList } from "./document-list"
import { emitMitraEvent } from "@/lib/mitra-analytics"
import { CircleCheck } from "lucide-react"

interface MessageBubbleProps {
  message: ChatMessage
  onTicketConfirm?: () => void
  onTicketDismiss?: () => void
  onDocumentSelect?: (doc: DocumentItem) => void
  onChipInBubble?: (chip: ChipOption) => void
}

export function MessageBubble({
  message,
  onTicketConfirm,
  onTicketDismiss,
  onDocumentSelect,
}: MessageBubbleProps) {
  const isBot = message.role === "bot"
  const time = format(message.timestamp, "h:mm a")

  return (
    <div
      className={cn(
        "flex w-full px-4 py-1",
        isBot ? "justify-start" : "justify-end"
      )}
      role="log"
      aria-label={`${isBot ? "Mitra" : "You"} at ${time}`}
    >
      <div
        className={cn(
          "max-w-[72%] space-y-1",
          !isBot && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
            isBot
              ? "rounded-tl-sm bg-mitra-bot text-mitra-bot-foreground"
              : "rounded-tr-sm bg-mitra-user text-mitra-user-foreground"
          )}
        >
          {message.text && (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}

          {message.card && <TrackingCard card={message.card} />}

          {message.documents && message.documents.length > 0 && onDocumentSelect && (
            <DocumentList
              documents={message.documents}
              onSelect={onDocumentSelect}
            />
          )}

          {message.ticket && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5">
              <CircleCheck className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Ticket created
                </p>
                <p className="font-mono text-xs text-emerald-600">
                  ID: {message.ticket.id}
                </p>
              </div>
            </div>
          )}

          {message.options && message.options.length === 2 &&
            message.options[0].intent === "confirm_ticket" &&
            onTicketConfirm && onTicketDismiss && (
              <TicketConfirm
                onConfirm={() => {
                  emitMitraEvent("ticket_confirmed")
                  onTicketConfirm()
                }}
                onDismiss={onTicketDismiss}
              />
            )}
        </div>

        <p
          className={cn(
            "px-1 text-xs text-mitra-timestamp",
            !isBot && "text-right"
          )}
          aria-hidden="true"
        >
          {time}
        </p>
      </div>
    </div>
  )
}
