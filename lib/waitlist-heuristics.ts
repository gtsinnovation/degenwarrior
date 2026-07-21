// Lightweight, honest anti-bot/authenticity signals for waitlist review.
// None of these auto-reject a signup — they only set an initial "flagged"
// status + reason so a human admin can review it, per the admin dashboard's
// waitlist-review requirement. Nothing here silently drops a real signup.

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "throwawaymail.com",
  "getnada.com",
  "sharklasers.com",
]);

export interface AuthenticityCheck {
  status: "pending" | "flagged";
  flagReason: string | null;
}

export function checkEmailAuthenticity(email: string): AuthenticityCheck {
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { status: "flagged", flagReason: "disposable_email_domain" };
  }
  return { status: "pending", flagReason: null };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
