"use client"

import type { ChipOption } from "@/lib/mitra-types"
import { emitMitraEvent } from "@/lib/mitra-analytics"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface QuickChipsProps {
  options: ChipOption[]
  onChipClick: (chip: ChipOption) => void
  disabled?: boolean
}

export function QuickChips({ options, onChipClick, disabled }: QuickChipsProps) {
  const [tappedIndex, setTappedIndex] = useState<number | null>(null)

  const handleClick = (chip: ChipOption, index: number) => {
    if (disabled) return
    setTappedIndex(index)
    emitMitraEvent("chip_clicked", chip.intent)
    onChipClick(chip)
    setTimeout(() => setTappedIndex(null), 300)
  }

  return (
    <div
      className="flex flex-wrap gap-2 px-4 pb-2"
      role="group"
      aria-label="Quick action suggestions"
    >
      {options.map((chip, index) => (
        <button
          key={`${chip.intent}-${index}`}
          onClick={() => handleClick(chip, index)}
          disabled={disabled}
          className={cn(
            "rounded-full border border-mitra-chip-border bg-mitra-chip-bg px-4 py-2 text-sm font-medium text-foreground",
            "transition-all duration-150",
            "hover:border-primary/40 hover:bg-mitra-chip-hover hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "min-h-[44px]",
            tappedIndex === index && "scale-95 border-primary bg-mitra-chip-hover"
          )}
          aria-label={chip.label}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
