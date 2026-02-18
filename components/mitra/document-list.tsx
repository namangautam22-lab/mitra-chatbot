"use client"

import { useState } from "react"
import type { DocumentItem } from "@/lib/mitra-types"
import { FileText, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentListProps {
  documents: DocumentItem[]
  onSelect: (doc: DocumentItem) => void
}

export function DocumentList({ documents, onSelect }: DocumentListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (doc: DocumentItem) => {
    setSelectedId(doc.id)
    onSelect(doc)
  }

  return (
    <div className="mt-2 space-y-1.5" role="radiogroup" aria-label="Select a document">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => handleSelect(doc)}
          role="radio"
          aria-checked={selectedId === doc.id}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
            "min-h-[44px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selectedId === doc.id
              ? "border-primary/40 bg-mitra-chip-hover"
              : "border-border bg-background hover:border-primary/20 hover:bg-muted/50"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
            <p className="text-xs text-muted-foreground">
              {doc.type} {doc.awb && <span className="font-mono">#{doc.awb}</span>}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                doc.status === "Delivered"
                  ? "bg-emerald-50 text-emerald-700"
                  : doc.status === "In Transit" || doc.status === "Dispatched"
                    ? "bg-amber-50 text-amber-700"
                    : doc.status === "Pending"
                      ? "bg-red-50 text-red-600"
                      : "bg-muted text-muted-foreground"
              )}
            >
              {doc.status}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      ))}
    </div>
  )
}
