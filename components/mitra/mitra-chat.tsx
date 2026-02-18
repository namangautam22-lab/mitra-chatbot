"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatHeader } from "@/components/mitra/chat-header"
import { ChatInput } from "@/components/mitra/chat-input"
import { MessageBubble } from "@/components/mitra/message-bubble"
import { QuickChips } from "@/components/mitra/quick-chips"
import { TypingIndicator } from "@/components/mitra/typing-indicator"
import { ErrorBanner } from "@/components/mitra/error-banner"

import type { ChatMessage, ChipOption, DocumentItem } from "@/lib/mitra-types"
import { getDemoResponse, WELCOME_MESSAGE_TEXT, INITIAL_CHIPS } from "@/lib/mitra-demo-data"
import { emitMitraEvent } from "@/lib/mitra-analytics"

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function MitraChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const initializedRef = useRef(false)

  // Initialize welcome message on the client only to avoid hydration mismatch
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      setMessages([
        {
          id: generateId(),
          role: "bot",
          text: WELCOME_MESSAGE_TEXT,
          timestamp: new Date(),
        },
      ])
    }
  }, [])
  const [chips, setChips] = useState<ChipOption[]>(INITIAL_CHIPS)
  const [isTyping, setIsTyping] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [pendingRetry, setPendingRetry] = useState<(() => void) | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  // Announce new messages for screen readers
  const announceMessage = (text: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = text
    }
  }

  const addBotResponse = useCallback(
    async (intentOrText: string, isIntent: boolean) => {
      setIsTyping(true)
      setChips([])
      setHasError(false)

      try {
        const response = await getDemoResponse(intentOrText, isIntent)

        const botMsg: ChatMessage = {
          id: response.id || generateId(),
          role: "bot",
          text: response.text,
          card: response.card,
          ticket: response.ticket,
          documents: response.documents,
          options: response.options,
          timestamp: new Date(),
        }

        setMessages((prev) => {
          // De-duplicate by id
          if (botMsg.id && prev.some((m) => m.id === botMsg.id)) return prev
          return [...prev, botMsg]
        })

        // If response has chip-style options (non-ticket), show as chips
        if (
          response.options &&
          response.options.length > 0 &&
          !(
            response.options.length === 2 &&
            response.options[0].intent === "confirm_ticket"
          )
        ) {
          setChips(response.options)
        }

        if (response.text) {
          announceMessage(`Mitra says: ${response.text}`)
        }
      } catch {
        setHasError(true)
        setPendingRetry(() => () => addBotResponse(intentOrText, isIntent))
      } finally {
        setIsTyping(false)
      }
    },
    []
  )

  const handleSendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      emitMitraEvent("message_sent")
      addBotResponse(text, false)
    },
    [addBotResponse]
  )

  const handleChipClick = useCallback(
    (chip: ChipOption) => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        text: chip.label,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setChips([])
      addBotResponse(chip.intent, true)
    },
    [addBotResponse]
  )

  const handleTicketConfirm = useCallback(() => {
    addBotResponse("confirm_ticket", true)
  }, [addBotResponse])

  const handleTicketDismiss = useCallback(() => {
    addBotResponse("dismiss_ticket", true)
  }, [addBotResponse])

  const handleDocumentSelect = useCallback(
    (doc: DocumentItem) => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        text: `Show details for ${doc.name}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      addBotResponse("doc_detail", true)
    },
    [addBotResponse]
  )

  const handleRetry = useCallback(() => {
    setHasError(false)
    if (pendingRetry) {
      pendingRetry()
      setPendingRetry(null)
    }
  }, [pendingRetry])

  const handleFreshLink = useCallback(() => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      text: "Get fresh link",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    addBotResponse("get_fresh_link", true)
  }, [addBotResponse])

  // Check if we need a "get fresh link" chip (simulated expired link)
  const showFreshLinkChip = messages.some(
    (m) => m.text?.includes("link has expired")
  )

  return (
    <div className="flex h-dvh flex-col bg-background">
      <ChatHeader />

      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Messages */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4 pt-3"
        role="log"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onTicketConfirm={handleTicketConfirm}
            onTicketDismiss={handleTicketDismiss}
            onDocumentSelect={handleDocumentSelect}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* Error */}
      {hasError && <ErrorBanner onRetry={handleRetry} />}

      {/* Chips */}
      {chips.length > 0 && !isTyping && (
        <QuickChips
          options={chips}
          onChipClick={handleChipClick}
          disabled={isTyping}
        />
      )}

      {showFreshLinkChip && !isTyping && chips.length === 0 && (
        <QuickChips
          options={[
            { label: "Get fresh link", intent: "get_fresh_link" },
          ]}
          onChipClick={() => handleFreshLink()}
          disabled={isTyping}
        />
      )}

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
