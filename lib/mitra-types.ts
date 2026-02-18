export interface TrackingCard {
  type: "tracking"
  awb: string
  courier?: string
  url: string
  expiresAt: string
}

export interface TicketInfo {
  id: string
  link?: string
}

export interface DocumentItem {
  id: string
  name: string
  type: string
  status: string
  awb?: string
}

export interface ChatMessage {
  id: string
  role: "bot" | "user"
  text?: string
  options?: ChipOption[]
  card?: TrackingCard
  ticket?: TicketInfo
  documents?: DocumentItem[]
  timestamp: Date
  isError?: boolean
  retryAction?: string
}

export interface ChipOption {
  label: string
  intent: string
  meta?: Record<string, string>
}

export interface IntentPayload {
  type: "intent"
  name: string
  meta?: Record<string, string>
}

export interface MessagePayload {
  type: "message"
  text: string
  history: ChatMessage[]
}

export type BotResponse = {
  id?: string
  text?: string
  options?: ChipOption[]
  card?: TrackingCard
  ticket?: TicketInfo
  documents?: DocumentItem[]
}
