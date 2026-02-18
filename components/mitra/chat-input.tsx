"use client"

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react"
import { SendHorizontal, Paperclip } from "lucide-react"
import { emitMitraEvent } from "@/lib/mitra-analytics"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    emitMitraEvent("message_sent")
    onSend(trimmed)
    setValue("")
    // Re-focus input after send
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isEmpty = value.trim().length === 0

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-background px-3 pb-[env(safe-area-inset-bottom,8px)] pt-2">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2"
      >
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Message input"
            style={{ maxHeight: "120px" }}
          />
        </div>

        <button
          type="submit"
          disabled={isEmpty || disabled}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary"
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
