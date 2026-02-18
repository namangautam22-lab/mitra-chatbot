import type { BotResponse, ChipOption } from "./mitra-types"

// Simulated delay to mimic real agent response
const DEMO_DELAY = 1200

// ---------------------------------------------------------------------------
// INTENT → BOT RESPONSE MAP
// Intents are derived from the SUB_CATEGORY column in the documentation chats.
// ---------------------------------------------------------------------------
const INTENT_RESPONSES: Record<string, BotResponse> = {
  // ── CORE NAVIGATION ──────────────────────────────────────────────────────

  /** Landing / greeting — triggers the category-picker chips */
  greeting: {
    text: "Hi! 😊 How can I help you today? If you have any document-related queries, just let me know the details.",
    options: [
      { label: "RC not received", intent: "original_rc_missing" },
      { label: "Interstate / State NOC", intent: "interstate_noc" },
      { label: "Loan NOC", intent: "loan_noc_not_received" },
      { label: "RTO Forms", intent: "rto_forms_missing" },
      { label: "Insurance copy", intent: "insurance_not_received" },
      { label: "Seller ID proof", intent: "seller_id_proof_missing" },
      { label: "Clearance Certificate", intent: "clearance_certificate" },
      { label: "Share digital copy", intent: "share_digital_copy" },
    ],
  },

  // ── SUB_CATEGORY: original_rc_missing ────────────────────────────────────
  // Session pattern: documentIssue_originalRcMissing_*
  // Typical user messages: "RC missing", "Original RC missing", "RC kab tak milegi",
  //   "Rc ki photo mngwa dijiye", "I need RC urgent"

  original_rc_missing: {
    text: "The Original RC is still pending and hasn't been received by CARS24 from the seller yet.\n\nWe're actively following up with a dedicated runner assigned. You can check the latest status on the documentation page.\n\nWould you like me to raise a support ticket to escalate this?",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── SUB_CATEGORY: interstate_/_interdistrict_noc ─────────────────────────
  // Session pattern: documentIssue_interstateNOC_*
  // Typical user messages: "Not received noc", "State noc please help",
  //   "Not responding 15 days noc transfer", "Fetch NOC for Karnataka"

  interstate_noc: {
    text: "Thanks for reaching out. As per our records, the Interstate / Interdistrict NOC has not been issued for this car yet.\n\nOur team is actively following up. You can check all document details on the documentation page.\n\nWould you like me to escalate this by raising a support ticket?",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── SUB_CATEGORY: loan_noc_not_received ──────────────────────────────────
  // Session pattern: documentIssue_loanNocNotReceived_*
  // Typical user messages: "Closer letter", "Loan NOC not available", "Mail copy"

  loan_noc_not_received: {
    text: "The Loan NOC is still being processed. As per our records, CARS24 expects to receive the NOC from the bank soon, and dispatch is expected shortly after.\n\nWe're closely following up and will dispatch it as soon as we receive it. Thanks for your patience! 😊\n\nShall I raise a support ticket to prioritise this?",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── SUB_CATEGORY: rto_forms_missing ──────────────────────────────────────
  // Session pattern: documentIssue_rtoFormMissing_*
  // Typical user messages: "Mail not sent to RTO", "Forms not received"

  rto_forms_missing: {
    text: "All RTO forms (Form 28, 29, 30, etc.) were dispatched via Delhivery courier.\n\nHere are the tracking details:",
    documents: [
      {
        id: "rto-form-28",
        name: "Form 28 – Notice of Transfer",
        type: "RTO Form",
        status: "Dispatched",
        awb: "33176410845143",
      },
      {
        id: "rto-form-29",
        name: "Form 29 – Transfer of Ownership",
        type: "RTO Form",
        status: "Dispatched",
        awb: "33176410845143",
      },
      {
        id: "rto-form-30",
        name: "Form 30 – Report of Transfer",
        type: "RTO Form",
        status: "Dispatched",
        awb: "33176410845143",
      },
    ],
  },

  // ── SUB_CATEGORY: seller_id_proof_missing ────────────────────────────────
  // Session pattern: documentIssue_sellerIdMissing_*
  // Typical user messages: "Aadhar card", "Pan card", "Second address proof",
  //   "Seller ID photo", "adhar card front side not available"

  seller_id_proof_missing: {
    text: "Here's the latest update for your Seller ID Proof 👇\n\nPlease select the document you'd like to track or download:",
    documents: [
      {
        id: "id-aadhaar-front",
        name: "Aadhaar Card (Front)",
        type: "ID Proof",
        status: "Dispatched",
        awb: "33176410744225",
      },
      {
        id: "id-aadhaar-back",
        name: "Aadhaar Card (Back)",
        type: "ID Proof",
        status: "Dispatched",
        awb: "33176410744225",
      },
      {
        id: "id-pan",
        name: "PAN Card",
        type: "ID Proof",
        status: "Dispatched",
        awb: "33176410744225",
      },
      {
        id: "id-address",
        name: "Address Proof (2nd)",
        type: "ID Proof",
        status: "Pending",
      },
    ],
  },

  // ── SUB_CATEGORY: clearance_certificate ──────────────────────────────────
  // Session pattern: documentIssue_clearanceCertificate_*

  clearance_certificate: {
    text: "I'm checking on the Clearance Certificate status for your car.\n\nThis document is typically issued after all formalities are complete. Our team is actively working on it.\n\nWould you like me to raise a support ticket to prioritise this?",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── SUB_CATEGORY: insurance_not_received ─────────────────────────────────
  // Session pattern: documentIssue_insuranceNotReceived_*
  // Typical user messages: "Need insurance copy"

  insurance_not_received: {
    text: "The insurance copy is still pending and hasn't been received from the seller yet.\n\nWe're following up closely and expect to dispatch it as soon as it's available. Thanks for your patience! 😊\n\nWould you like me to raise a ticket to escalate this?",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── DOCUMENT TRACKING ────────────────────────────────────────────────────

  track_document: {
    text: "I found multiple documents linked to your account. Please select the one you'd like to track:",
    documents: [
      {
        id: "doc-rc",
        name: "Registration Certificate (RC)",
        type: "RC",
        status: "In Transit",
        awb: "33176410845199",
      },
      {
        id: "doc-noc",
        name: "No Objection Certificate (NOC)",
        type: "NOC",
        status: "Delivered",
        awb: "33176410744225",
      },
      {
        id: "doc-insurance",
        name: "Insurance Policy",
        type: "Insurance",
        status: "Processing",
      },
      {
        id: "doc-rto",
        name: "RTO Forms (28 / 29 / 30)",
        type: "RTO Form",
        status: "Dispatched",
        awb: "33176410845143",
      },
    ],
  },

  share_digital_copy: {
    text: "Here is the digital copy link for your RC. Please download it before it expires (valid for 30 minutes).",
    card: {
      type: "tracking",
      awb: "33176410845199",
      courier: "Delhivery",
      url: "https://www.delhivery.com/track-v2/package/33176410845199",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },

  // ── LEGACY / COMPATIBILITY ───────────────────────────────────────────────
  // Kept for backward compatibility with existing chip handlers.

  rc_not_received: {
    text: "I'm sorry to hear that. Let me check the status of your RC.\n\nIt looks like your RC has not yet been received from the seller. We're actively following up.",
    options: [
      { label: "Yes — raise a ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  // ── TICKET FLOW ──────────────────────────────────────────────────────────

  raise_ticket: {
    text: "I can raise a support ticket for you. This will be assigned to our document team and you'll receive updates via SMS.",
    options: [
      { label: "Yes — raise ticket", intent: "confirm_ticket" },
      { label: "Not now", intent: "dismiss_ticket" },
    ],
  },

  confirm_ticket: {
    text: "Done! Your support ticket has been created. ✅",
    ticket: {
      id: "TKT-2026-04821",
      link: "https://example.com/tickets/TKT-2026-04821",
    },
  },

  dismiss_ticket: {
    text: "No problem. Let me know if you need anything else.",
  },

  // ── FRESH LINK / DOC DETAIL ──────────────────────────────────────────────

  get_fresh_link: {
    text: "Here's a fresh tracking link for your document (valid for 30 minutes):",
    card: {
      type: "tracking",
      awb: "33176410845199",
      courier: "Delhivery",
      url: "https://www.delhivery.com/track-v2/package/33176410845199?refresh=1",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },

  doc_detail: {
    text: "Here are the tracking details for your selected document (link valid for 30 minutes):",
    card: {
      type: "tracking",
      awb: "33176410845199",
      courier: "Delhivery",
      url: "https://www.delhivery.com/track-v2/package/33176410845199",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },

  rto_form_detail: {
    text: "Here are the tracking details for your RTO forms:",
    card: {
      type: "tracking",
      awb: "33176410845143",
      courier: "Delhivery",
      url: "https://www.delhivery.com/track-v2/package/33176410845143",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },

  id_proof_detail: {
    text: "Here are the tracking details for your ID proof documents:",
    card: {
      type: "tracking",
      awb: "33176410744225",
      courier: "Delhivery",
      url: "https://www.delhivery.com/track-v2/package/33176410744225",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  },
}

// ---------------------------------------------------------------------------
// FREE-TEXT → RESPONSE (multilingual: English / Hindi / Hinglish)
// ---------------------------------------------------------------------------
const FREE_TEXT_RESPONSES: Array<{ pattern: RegExp; response: BotResponse }> = [
  // ── RC / Registration Certificate ───────────────────────────────────────
  {
    pattern:
      /\brc\b|registration.?cert|rc.?miss|rc.?nahi|rc.?kab|rc.?photo|rc.?pic|rc.?copy|original.?rc|urgent.*rc|rc.*urgent/i,
    response: INTENT_RESPONSES.original_rc_missing,
  },

  // ── Interstate / State NOC ──────────────────────────────────────────────
  {
    pattern:
      /interstate|interdistrict|state.?noc|noc.?transfer|noc.?kab|not.?received.?noc|noc.?nahi|noc.?mil/i,
    response: INTENT_RESPONSES.interstate_noc,
  },

  // ── Loan NOC ────────────────────────────────────────────────────────────
  {
    pattern: /loan.?noc|bank.?noc|closer.?letter|loan.*noc|noc.*loan/i,
    response: INTENT_RESPONSES.loan_noc_not_received,
  },

  // ── General NOC (fallback) ───────────────────────────────────────────────
  {
    pattern: /\bnoc\b|objection.?cert|no.?objection/i,
    response: INTENT_RESPONSES.interstate_noc,
  },

  // ── RTO Forms ───────────────────────────────────────────────────────────
  {
    pattern: /rto.?form|form.?28|form.?29|form.?30|rto.?miss|forms.?not|mail.?not.?sent/i,
    response: INTENT_RESPONSES.rto_forms_missing,
  },

  // ── Seller ID Proof / Aadhaar / PAN ─────────────────────────────────────
  {
    pattern:
      /aadhaar|aadhar|adhar|pan.?card|seller.?id|id.?proof|address.?proof|pehchaan|pahchaan/i,
    response: INTENT_RESPONSES.seller_id_proof_missing,
  },

  // ── Clearance Certificate ────────────────────────────────────────────────
  {
    pattern: /clearance.?cert|clearance/i,
    response: INTENT_RESPONSES.clearance_certificate,
  },

  // ── Insurance ───────────────────────────────────────────────────────────
  {
    pattern: /insurance|insure|bima/i,
    response: INTENT_RESPONSES.insurance_not_received,
  },

  // ── Tracking / Status ───────────────────────────────────────────────────
  {
    pattern: /track|status|where|kahan|kab.?milega|kab.?ayega|kab.?aayega/i,
    response: INTENT_RESPONSES.track_document,
  },

  // ── Digital copy ────────────────────────────────────────────────────────
  {
    pattern: /digital|copy|download|link|photo|pic|image/i,
    response: INTENT_RESPONSES.share_digital_copy,
  },

  // ── Ticket / Escalate ───────────────────────────────────────────────────
  {
    pattern: /ticket|complaint|escalate|raise.*ticket|support/i,
    response: INTENT_RESPONSES.raise_ticket,
  },

  // ── Hindi / Hinglish generic "not received" ──────────────────────────────
  {
    pattern: /nahi.?mila|nahin.?mila|nahi.?aaya|nahi.?aya|not.?received|not.?getting/i,
    response: INTENT_RESPONSES.track_document,
  },

  // ── Penalty / Legal urgency ──────────────────────────────────────────────
  {
    pattern: /penalty|penalt|jukr|fine|court|legal|rto.?notice/i,
    response: {
      text: "I understand this is urgent. To avoid penalties, it's important that all documents are submitted to the RTO on time.\n\nOur team is actively following up with the seller. Would you like me to raise a priority support ticket?",
      options: [
        { label: "Yes — raise a ticket", intent: "confirm_ticket" },
        { label: "Not now", intent: "dismiss_ticket" },
      ],
    },
  },
]

// ---------------------------------------------------------------------------
// DEFAULT RESPONSE (when no pattern matches)
// ---------------------------------------------------------------------------
const DEFAULT_RESPONSE: BotResponse = {
  text: "I'm here to help with document tracking, digital copies, and support tickets.\n\nHere are the most common issues I can help with:",
  options: [
    { label: "RC not received", intent: "original_rc_missing" },
    { label: "Interstate / State NOC", intent: "interstate_noc" },
    { label: "Loan NOC", intent: "loan_noc_not_received" },
    { label: "RTO Forms", intent: "rto_forms_missing" },
    { label: "Insurance copy", intent: "insurance_not_received" },
    { label: "Raise a ticket", intent: "raise_ticket" },
  ],
}

// ---------------------------------------------------------------------------
// REPEATED QUESTION TRACKING
// ---------------------------------------------------------------------------
let lastQuestion = ""
let repeatCount = 0

// ---------------------------------------------------------------------------
// MAIN DEMO RESPONSE FUNCTION
// ---------------------------------------------------------------------------
export async function getDemoResponse(
  intentOrText: string,
  isIntent: boolean
): Promise<BotResponse> {
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY))

  if (isIntent) {
    lastQuestion = ""
    repeatCount = 0
    return INTENT_RESPONSES[intentOrText] ?? DEFAULT_RESPONSE
  }

  // Track repeated questions to offer escalation
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
        { label: "Yes — raise ticket", intent: "confirm_ticket" },
        { label: "Not now", intent: "dismiss_ticket" },
      ],
    }
  }

  // Match free text against multilingual patterns
  for (const { pattern, response } of FREE_TEXT_RESPONSES) {
    if (pattern.test(intentOrText)) {
      return response
    }
  }

  return DEFAULT_RESPONSE
}

// ---------------------------------------------------------------------------
// WELCOME MESSAGE
// ---------------------------------------------------------------------------
export const WELCOME_MESSAGE_TEXT =
  "Hi \u2014 I'm Mitra \ud83d\udc4b\nI can help with RC, NOC, Insurance, Loan NOC, RTO Forms, and Seller ID documents.\nWhat can I help you with today?"

// ---------------------------------------------------------------------------
// INITIAL CHIPS  (shown right after the welcome message)
// Maps directly to the 7 SUB_CATEGORY values from the documentation chats.
// ---------------------------------------------------------------------------
export const INITIAL_CHIPS: ChipOption[] = [
  { label: "RC not received", intent: "original_rc_missing" },
  { label: "Interstate / State NOC", intent: "interstate_noc" },
  { label: "Loan NOC", intent: "loan_noc_not_received" },
  { label: "RTO Forms", intent: "rto_forms_missing" },
  { label: "Insurance copy", intent: "insurance_not_received" },
  { label: "Seller ID proof", intent: "seller_id_proof_missing" },
  { label: "Share digital copy", intent: "share_digital_copy" },
  { label: "Raise a ticket", intent: "raise_ticket" },
]
