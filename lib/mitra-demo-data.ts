import type { BotResponse, ChipOption } from "./mitra-types"

// Simulated delay to mimic real agent response
const DEMO_DELAY = 1200

// Demo response map keyed by intent
const INTENT_RESPONSES: Record<string, BotResponse> = {
  track_document: {
    text: "I found multiple documents linked to your account. Please select the one you'd like to track:",
    documents: [
      {
        id: "doc-1",
        name: "Registration Certificate",
        type: "RC",
        status: "In Transit",
        awb: "AWB9281736450",
      },
      {
        id: "doc-2",
        name: "No Objection Certificate",
        type: "NOC",
        status: "Delivered",
        awb: "AWB7362518490",
      },
      {
        id: "doc-3",
        name: "Insurance Policy",
        type: "Insurance",
        status: "Processing",
      },
    ],
  },
  share_digital_copy: {
    text: "Here is the digital copy link for your RC. Please download it before it expires.",
    card: {
      type: "tracking",
      awb: "AWB9281736450",
      courier: "BlueDart Express",
      url: "https://example.com/track/AWB9281736450",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
  rc_not_received: {
    text: "I'm sorry to hear that. Let me check the status of your RC.\n\nIt looks like your RC was dispatched on 10 Feb and is currently in transit via BlueDart.",
    card: {
      type: "tracking",
      awb: "AWB9281736450",
      courier: "BlueDart Express",
      url: "https://example.com/track/AWB9281736450",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
  raise_ticket: {
    text: "I can raise a support ticket for you. This will be assigned to our document team and you'll receive updates via SMS.",
    options: [
      { label: "Yes \u2014 raise ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },
  confirm_ticket: {
    text: "Done! Your support ticket has been created.",
    ticket: {
      id: "TKT-2026-04821",
      link: "https://example.com/tickets/TKT-2026-04821",
    },
  },
  dismiss_ticket: {
    text: "No problem. Let me know if you need anything else.",
  },
  get_fresh_link: {
    text: "Here's a fresh tracking link for your document:",
    card: {
      type: "tracking",
      awb: "AWB9281736450",
      courier: "BlueDart Express",
      url: "https://example.com/track/AWB9281736450?refresh=1",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
  doc_detail: {
    text: "Here are the tracking details for your selected document:",
    card: {
      type: "tracking",
      awb: "AWB9281736450",
      courier: "BlueDart Express",
      url: "https://example.com/track/AWB9281736450",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
}

// Fallback for free-text messages
const FREE_TEXT_RESPONSES: Array<{ pattern: RegExp; response: BotResponse }> = [
  {
    pattern: /track|status|where|kahan|kab/i,
    response: INTENT_RESPONSES.track_document,
  },
  {
    pattern: /rc|registration/i,
    response: INTENT_RESPONSES.rc_not_received,
  },
  {
    pattern: /ticket|complaint|escalate/i,
    response: INTENT_RESPONSES.raise_ticket,
  },
  {
    pattern: /digital|copy|download/i,
    response: INTENT_RESPONSES.share_digital_copy,
  },
  {
    pattern: /noc|objection/i,
    response: {
      text: "Your NOC was delivered on 5 Feb. If you haven't received it, I can help raise a ticket.",
      options: [
        { label: "Yes \u2014 raise ticket", intent: "confirm_ticket" },
        { label: "Not now", intent: "dismiss_ticket" },
      ],
    },
  },
  {
    pattern: /insurance/i,
    response: {
      text: "Your Insurance document is currently being processed. It should be dispatched within 3-5 business days. Would you like me to notify you when it ships?",
    },
  },
]

const DEFAULT_RESPONSE: BotResponse = {
  text: "I'm here to help with document tracking, digital copies, and support tickets. Could you tell me more about what you need?",
  options: [
    { label: "Track my document", intent: "track_document" },
    { label: "Share digital copy", intent: "share_digital_copy" },
    { label: "Raise a ticket", intent: "raise_ticket" },
  ],
}

// Repeated question tracking
let lastQuestion = ""
let repeatCount = 0

export async function getDemoResponse(
  intentOrText: string,
  isIntent: boolean
): Promise<BotResponse> {
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY))

  if (isIntent) {
    lastQuestion = ""
    repeatCount = 0
    return INTENT_RESPONSES[intentOrText] || DEFAULT_RESPONSE
  }

  // Track repeated questions
  const normalized = intentOrText.toLowerCase().trim()
  if (normalized === lastQuestion) {
    repeatCount++
  } else {
    lastQuestion = normalized
    repeatCount = 1
  }

  if (repeatCount >= 2) {
    repeatCount = 0
    lastQuestion = ""
    return {
      text: "It seems like we're going in circles. Would you like me to raise a support ticket to escalate this?",
      options: [
        { label: "Yes \u2014 raise ticket", intent: "confirm_ticket" },
        { label: "Not now", intent: "dismiss_ticket" },
      ],
    }
  }

  // Match free text against patterns
  for (const { pattern, response } of FREE_TEXT_RESPONSES) {
    if (pattern.test(intentOrText)) {
      return response
    }
  }

  return DEFAULT_RESPONSE
}

export const WELCOME_MESSAGE_TEXT =
  "Hi \u2014 I'm Mitra \ud83d\udc4b\nI can help with RC, NOC, Insurance, RTO Forms, and tracking.\nWhat can I help you with today?"

export const INITIAL_CHIPS: ChipOption[] = [
  { label: "Track my document", intent: "track_document" },
  { label: "Share digital copy", intent: "share_digital_copy" },
  { label: "I haven't received my RC", intent: "rc_not_received" },
  { label: "Raise a ticket", intent: "raise_ticket" },
]
