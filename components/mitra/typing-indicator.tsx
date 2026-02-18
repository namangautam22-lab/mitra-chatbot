"use client"

export function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-2 px-4 py-2"
      role="status"
      aria-label="Mitra is typing"
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-mitra-bot px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
      </div>
      <span className="sr-only">Mitra is typing a response</span>
    </div>
  )
}
