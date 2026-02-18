"use client"

import { Bot } from "lucide-react"

export function ChatHeader() {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm"
      role="banner"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        aria-hidden="true"
      >
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-base font-semibold leading-tight text-foreground">
          Mitra
        </h1>
        <p className="text-xs leading-tight text-muted-foreground">
          Your Document Support Assistant
        </p>
      </div>
    </header>
  )
}
