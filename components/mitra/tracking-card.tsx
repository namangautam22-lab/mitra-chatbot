"use client"

import { ExternalLink, AlertTriangle } from "lucide-react"
import type { TrackingCard as TrackingCardType } from "@/lib/mitra-types"
import { emitMitraEvent } from "@/lib/mitra-analytics"

interface TrackingCardProps {
  card: TrackingCardType
}

export function TrackingCard({ card }: TrackingCardProps) {
  const handleClick = () => {
    emitMitraEvent("link_clicked", "track_document")
  }

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="px-4 py-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tracking Details
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">AWB</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {card.awb}
          </span>
        </div>
        {card.courier && (
          <p className="mt-1 text-sm text-muted-foreground">
            via {card.courier}
          </p>
        )}
      </div>
      <div className="border-t border-border px-4 py-2.5">
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          aria-label={`Track document with AWB ${card.awb}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Track document
        </a>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          Link valid for 30 minutes.
        </p>
      </div>
    </div>
  )
}
