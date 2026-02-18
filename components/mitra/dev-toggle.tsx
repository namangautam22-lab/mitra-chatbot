"use client"

import { cn } from "@/lib/utils"

interface DevToggleProps {
  isLive: boolean
  onToggle: (live: boolean) => void
}

export function DevToggle({ isLive, onToggle }: DevToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-border bg-amber-50 px-4 py-1.5">
      <span className="text-xs font-medium text-amber-800">Mode:</span>
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
          !isLive
            ? "bg-amber-200 text-amber-900"
            : "text-amber-700 hover:bg-amber-100"
        )}
      >
        Demo data
      </button>
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
          isLive
            ? "bg-amber-200 text-amber-900"
            : "text-amber-700 hover:bg-amber-100"
        )}
      >
        Live agent
      </button>
    </div>
  )
}
