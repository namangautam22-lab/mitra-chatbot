"use client"

import { RefreshCw } from "lucide-react"
import { emitMitraEvent } from "@/lib/mitra-analytics"

interface ErrorBannerProps {
  message?: string
  onRetry: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const handleRetry = () => {
    emitMitraEvent("error_retry")
    onRetry()
  }

  return (
    <div
      className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5"
      role="alert"
    >
      <p className="text-sm text-destructive">
        {message || "Connection problem"}
      </p>
      <button
        onClick={handleRetry}
        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Try again"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  )
}
